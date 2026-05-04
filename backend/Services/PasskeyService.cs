using System.Text;
using Fido2NetLib;
using Fido2NetLib.Objects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

public class PasskeyService : IPasskeyService
{
    private readonly Fido2 _fido2;
    private readonly AppDbContext _db;
    private readonly IMemoryCache _cache;
    private readonly ITokenService _tokenService;

    public PasskeyService(Fido2 fido2, AppDbContext db, IMemoryCache cache, ITokenService tokenService)
    {
        _fido2 = fido2;
        _db = db;
        _cache = cache;
        _tokenService = tokenService;
    }

    // ================= REGISTER =================
    public async Task<CredentialCreateOptions> CreateRegisterOptions(long userId, string email)
    {
        var user = new Fido2User
        {
            // 🔥 dùng userHandle chuẩn (long → byte[])
            Id = BitConverter.GetBytes(userId),
            Name = email,
            DisplayName = email
        };

        var existingKeys = await _db.Passkeys
            .Where(x => x.UserId == userId)
            .Select(x => new PublicKeyCredentialDescriptor(
                Base64UrlHelper.Decode(x.CredentialId)))
            .ToListAsync();

        var options = _fido2.RequestNewCredential(new RequestNewCredentialParams
        {
            User = user,
            ExcludeCredentials = existingKeys,
            AuthenticatorSelection = new AuthenticatorSelection
            {
                UserVerification = UserVerificationRequirement.Preferred
            },
            AttestationPreference = AttestationConveyancePreference.None
        });

        // 🔥 cache 5 phút
        _cache.Set($"register_{userId}", options, TimeSpan.FromMinutes(5));

        return options;
    }

    public async Task<bool> RegisterPasskey(long userId, AuthenticatorAttestationRawResponse response)
    {
        if (!_cache.TryGetValue($"register_{userId}", out CredentialCreateOptions options))
            throw new Exception("Register session expired");

        var result = await _fido2.MakeNewCredentialAsync(new MakeNewCredentialParams
        {
            AttestationResponse = response,
            OriginalOptions = options,
            IsCredentialIdUniqueToUserCallback = async (args, ct) =>
            {
                var credId = Base64UrlHelper.Encode(args.CredentialId);

                return !await _db.Passkeys.AnyAsync(x =>
                    x.CredentialId == credId);
            }
        });

        var passkey = new Passkey
        {
            UserId = userId,

            // 🔥 FIX: lấy từ result.Result
            CredentialId = Base64UrlHelper.Encode(response.RawId),
            PublicKey = Base64UrlHelper.Encode(result.PublicKey),

            // 🔥 FIX: Counter nằm ở result.Result
            SignCount = result.SignCount,

            DeviceName = "Unknown device",
            CreateAt = DateTime.Now
        };

        _db.Passkeys.Add(passkey);
        await _db.SaveChangesAsync();

        // cleanup
        _cache.Remove($"register_{userId}");

        return true;
    }

    // ================= LOGIN =================

    // 🔥 Không cần username (discoverable credential)
    public Task<AssertionOptions> CreateLoginOptions()
    {
        var options = _fido2.GetAssertionOptions(new GetAssertionOptionsParams
        {
            UserVerification = UserVerificationRequirement.Preferred
        });

        _cache.Set("login", options, TimeSpan.FromMinutes(5));

        return Task.FromResult(options);
    }

    public async Task<AuthResponse?> VerifyLogin(AuthenticatorAssertionRawResponse response)
    {
        if (!_cache.TryGetValue("login", out AssertionOptions? options) || options == null)
            throw new Exception("Login session expired");

        var credentialId = Base64UrlHelper.Encode(response.RawId);

        var passkey = await _db.Passkeys
            .FirstOrDefaultAsync(x => x.CredentialId == credentialId);

        if (passkey == null)
            return null;

        var result = await _fido2.MakeAssertionAsync(new MakeAssertionParams
        {
            AssertionResponse = response,
            OriginalOptions = options,

            StoredPublicKey = Base64UrlHelper.Decode(passkey.PublicKey),
            StoredSignatureCounter = passkey.SignCount,

            // 🔥 verify userHandle (chuẩn WebAuthn)
            IsUserHandleOwnerOfCredentialIdCallback = async (args, ct) =>
            {
                if (args.UserHandle == null) return false;

                var userId = BitConverter.ToInt64(args.UserHandle, 0);

                return await _db.Passkeys.AnyAsync(x =>
                    x.UserId == userId &&
                    x.CredentialId == Base64UrlHelper.Encode(args.CredentialId));
            }
        });

        // 🔥 update counter chống replay attack
        passkey.SignCount = result.SignCount;
        await _db.SaveChangesAsync();

        var user = await _db.Users
    .FirstOrDefaultAsync(x => x.Id == passkey.UserId);

        if (user == null)
            throw new Exception("User not found");

        if (!user.IsActive)
        {
            throw new Exception("Tài khoản của bạn đã bị vô hiệu hóa");
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = await _tokenService.GenerateRefreshToken(user, "", "");

        _cache.Remove("login");

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.Now.AddMinutes(1)
        };
    }
}