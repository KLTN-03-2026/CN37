using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

public class TokenService : ITokenService
{
    private readonly JwtOptions _jwtOptions;
    private readonly AppDbContext _context;
    public TokenService(IOptions<JwtOptions> jwtOptions, AppDbContext context)
    {
        _jwtOptions = jwtOptions.Value;
        _context = context;
    }

    public string GenerateAccessToken(User user, List<string> roles)
    {
        if (string.IsNullOrEmpty(_jwtOptions.SecretKey))
            throw new Exception("JWT SecretKey is missing");

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),

            // 🔥 nên thêm cái này (chuẩn .NET)
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        };

        // 🔥 add roles vào JWT
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateRefreshToken(User user, string deviceInfo, string ip)
    {
        var refreshTokenValue = Guid.NewGuid().ToString();
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow,
            DeviceInfo = deviceInfo,
            IpAddress = ip
        };
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        var session = new Session
        {
            UserId = user.Id,
            RefreshTokenId = refreshToken.Id,
            DeviceInfo = deviceInfo,
            IpAddress = ip
        };
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return refreshTokenValue;
    }

    public async Task<List<SessionResponse>> GetSessionsAsync(long userId, string currentRefreshToken)
    {
        var currentTokenHash = Hash(currentRefreshToken);

        var sessions = await (
            from s in _context.Sessions
            join r in _context.RefreshTokens
                on s.RefreshTokenId equals r.Id
            where s.UserId == userId && !r.IsRevoked
            orderby s.LastActiveAt descending
            select new SessionResponse
            {
                SessionId = s.Id,
                Device = s.DeviceInfo,
                Ip = s.IpAddress,
                LastActive = s.LastActiveAt,
                CreatedAt = s.CreateAt,
                IsCurrent = r.TokenHash == currentTokenHash
            }
        ).ToListAsync();

        return sessions;
    }

    public async Task<bool> LogoutSessionAsync(long userId, long sessionId)
    {
        Console.WriteLine(sessionId);
        // 1. Tìm session thuộc user
        var session = await _context.Sessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            return false;



        // 2. Lấy refresh token tương ứng
        var refresh = await _context.RefreshTokens
            .FirstOrDefaultAsync(r => r.Id == session.RefreshTokenId);

        if (refresh == null)
            return false;

        // 3. Revoke refresh token
        refresh.IsRevoked = true;
        refresh.RevokedAt = DateTime.UtcNow;

        // 4. Xóa session (khuyến nghị)
        _context.Sessions.Remove(session);

        await _context.SaveChangesAsync();

        return true;
    }

    private string Hash(string input)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(input);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var searchToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == refreshToken);
        if (searchToken == null)
        {
            throw new Exception("Refresh Token không hợp lệ");
        }
        if (searchToken.IsRevoked)
        {
            throw new Exception("Refresh Token đã bị thu hồi");
        }
        if (searchToken.ExpiresAt < DateTime.UtcNow)
        {
            searchToken.IsRevoked = true;
            searchToken.RevokedAt = DateTime.UtcNow;
            throw new Exception("Refresh Token đã hết hạn");
        }
        var user = await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(x => x.Id == searchToken.UserId);
        if (user == null)
        {
            throw new Exception("user này không tồn tại");
        }
        searchToken.IsRevoked = true;
        searchToken.RevokedAt = DateTime.UtcNow;
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var newAccessToken = GenerateAccessToken(user, roles);
        var newRefreshTokenValue = Guid.NewGuid().ToString();
        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenValue,
            ExpiresAt = searchToken.ExpiresAt,
            CreatedAt = DateTime.UtcNow,
            DeviceInfo = searchToken.DeviceInfo,
            IpAddress = searchToken.IpAddress
        };
        await _context.RefreshTokens.AddAsync(newRefreshToken);
        await _context.SaveChangesAsync();

        var session = new Session
        {
            UserId = user.Id,
            RefreshTokenId = newRefreshToken.Id,
            DeviceInfo = newRefreshToken.DeviceInfo,
            IpAddress = newRefreshToken.IpAddress
        };
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes),
        };
    }
}