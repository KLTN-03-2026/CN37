using System.Text.RegularExpressions;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;
    private readonly IEmailVerificationService _emailVerify;
    private readonly AppDbContext _context;
    public AuthService(IUserRepository userRepo, IPasswordService passwordService, ITokenService tokenService, IEmailVerificationService emailVerification, AppDbContext context)
    {
        _userRepo = userRepo;
        _passwordService = passwordService;
        _tokenService = tokenService;
        _emailVerify = emailVerification;
        _context = context;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (request.Password == "" || request.ConfirmPassword == "" || request.Email == "")
        {
            throw new Exception("Hãy nhập đầy đủ các ô đăng kí.");
        }
        if (!IsValidEmail(request.Email))
        {
            throw new Exception("Email này không đúng định dạng.");
        }
        var existingUser = await _userRepo.GetUserWithRolesByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new Exception("Email này đã được đăng kí.");
        }
        ValidatePassword(request.Password, request.ConfirmPassword);
        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _userRepo.AddUserAsync(user);
        await _userRepo.SaveChangesAsync();

        var userRole = await _context.Roles
        .FirstOrDefaultAsync(r => r.Name == "USER");
        if (userRole != null)
        {
            var userUserRole = new UserRole
            {
                UserId = user.Id,
                RoleId = userRole.Id
            };
            _context.UserRoles.Add(userUserRole);
            await _context.SaveChangesAsync();
        }

        await _emailVerify.SendVerificationEmailAsync(user);
        var roles = existingUser?.UserRoles.Select(ur => ur.Role.Name).ToList();
        var tokenService = _tokenService.GenerateAccessToken(user, roles);
        return new AuthResponse
        {
            AccessToken = tokenService,
            ExpiresAt = DateTime.UtcNow.AddMinutes(1)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, string ip)
    {
        var user = await _userRepo.GetUserWithRolesByEmailAsync(request.Email);
        if (user == null || request.Password == null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new Exception("Email hoặc mật khẩu không chính xác");
        }
        if (!user.EmailVerified)
        {
            throw new Exception("Hãy xác thực email trước khi đăng nhập!");
        }
        if (!user.IsActive)
        {
            throw new Exception("Tài khoản của bạn đã bị vô hiệu hóa.");
        }
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        Console.WriteLine("ROLES: " + string.Join(",", roles));
        var refreshToken = await _tokenService.GenerateRefreshToken(user, request.DeviceInfo, ip);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(1)
        };
    }

    public async Task LogOutAsync(LogOutRequest request)
    {
        var searchToken = await _userRepo.GetRefreshToken(request.refreshToken);
        if (searchToken == null)
        {
            Console.WriteLine("null");
            throw new Exception("Không tồn tại token");

        }
        searchToken.IsRevoked = true;
        searchToken.RevokedAt = DateTime.UtcNow;
        await _userRepo.SaveChangesAsync();
    }

    public void ValidatePassword(string password, string confirmPassword)
    {
        if (password != confirmPassword)
        {
            throw new Exception("Mật khẩu không trùng khớp.");
        }
        if (password == null || password.Length < 8)
        {
            throw new Exception("Mật khẩu phải ít nhất 8 kí tự.");
        }
        if (!password.Any(char.IsUpper))
        {
            throw new Exception("Mật khẩu phải chứa ít nhất 1 chữ hoa.");
        }
        if (!password.Any(char.IsNumber))
        {
            throw new Exception("Mật khẩu phải chứa ít nhất 1 số.");
        }
    }

    public async Task<AuthResponse> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload, string deviceInfo, string ip)
    {
        // 1. Tìm trong ExternalLogins trước (Dùng Subject của Google là chuẩn nhất)
        var external = await _context.ExternalLogins
            .FirstOrDefaultAsync(x => x.Provider == "google" && x.ProviderUserId == payload.Subject);

        User user = null;

        if (external != null)
        {
            user = await _context.Users.FirstOrDefaultAsync(x => x.Id == external.UserId);
        }
        else
        {
            // 2. Nếu chưa có ExternalLogin, kiểm tra Email trong bảng Users
            user = await _context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (user == null)
                {
                    // 3. Tạo User mới hoàn toàn
                    user = new User
                    {
                        Email = payload.Email,
                        PasswordHash = null, // Đăng nhập MXH không cần pass
                        IsActive = true,
                        EmailVerified = true,
                        EmailVerifiedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync(); // Lưu để có User.Id
                }

                // 4. Kiểm tra/Tạo UserProfile
                var profile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == user.Id);
                if (profile == null)
                {
                    profile = new UserProfile
                    {
                        UserId = user.Id,
                        FullName = payload.Name,
                        Avatar = payload.Picture
                    };
                    await _context.UserProfiles.AddAsync(profile);
                }

                // 5. Tạo liên kết ExternalLogin
                var newExternal = new ExternalLogin
                {
                    UserId = user.Id,
                    Provider = "google",
                    ProviderUserId = payload.Subject,
                    Email = payload.Email
                };
                await _context.ExternalLogins.AddAsync(newExternal);
                var userRole = await _context.Roles
                        .FirstOrDefaultAsync(r => r.Name == "USER");
                if (userRole != null)
                {
                    var userUserRole = new UserRole
                    {
                        User = user,
                        RoleId = userRole.Id
                    };
                    await _context.UserRoles.AddAsync(userUserRole);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw new Exception("Lỗi trong quá trình tạo tài khoản Google.");
            }
        }

        if (user == null || !user.IsActive)
        {
            throw new Exception("Tài khoản không tồn tại hoặc đã bị khóa.");
        }
        var user1 = await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Id == user.Id);
        var roles = user1?.UserRoles.Select(ur => ur.Role.Name).ToList();
        // 6. Tạo Token hệ thống
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = await _tokenService.GenerateRefreshToken(user, deviceInfo, ip);
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(1) // Nên để thời gian dài hơn 1 phút để test
        };
    }

    public Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user == null)
        {
            throw new Exception("Không tìm thấy tài khoản với email này.");
        }
        return _emailVerify.sendResetPasswordEmailAsync(user);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        ValidatePassword(request.Password, request.ConfirmPassword);
        if (string.IsNullOrEmpty(request.Token))
        {
            throw new Exception("Token is required.");
        }
        var tokens = _context.ResetPasswordTokens.Where(t => !t.IsUsed && t.ExpiresAt > DateTime.UtcNow).ToList();
        var matchingToken = tokens.FirstOrDefault(x => BCrypt.Net.BCrypt.Verify(request.Token, x.TokenHash));
        if (matchingToken == null)
        {
            throw new Exception("Invalid or expired token.");
        }
        var user = await _context.Users.FindAsync(matchingToken.UserId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        matchingToken.IsUsed = true;
        await _context.SaveChangesAsync();
    }

    public bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        return Regex.IsMatch(email, pattern);
    }
}