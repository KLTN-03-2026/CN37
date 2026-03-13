public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;
    private readonly IEmailVerificationService _emailVerify;
    public AuthService(IUserRepository userRepo, IPasswordService passwordService, ITokenService tokenService, IEmailVerificationService emailVerification)
    {
        _userRepo = userRepo;
        _passwordService = passwordService;
        _tokenService = tokenService;
        _emailVerify = emailVerification;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if(request.Password == "" || request.ConfirmPassword == ""|| request.Email == "")
        {
            throw new Exception("Hãy nhập đầy đủ các ô đăng kí.");
        }
        var existingUser = await _userRepo.GetUserByEmailAsync(request.Email);
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

        await _emailVerify.SendVerificationEmailAsync(user);
        var tokenService = _tokenService.GenerateAccessToken(user);
        return new AuthResponse
        {
            AccessToken = tokenService,
            ExpiresAt = DateTime.UtcNow.AddMinutes(1)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepo.GetUserByEmailAsync(request.Email);
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
        var refreshToken = await _tokenService.GenerateRefreshToken(user);
        var accessToken = _tokenService.GenerateAccessToken(user);
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


}