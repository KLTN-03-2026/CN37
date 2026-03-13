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
    public string GenerateAccessToken(User user)
    {
        if (string.IsNullOrEmpty(_jwtOptions.SecretKey))
            throw new Exception("JWT SecretKey is missing");
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }
    public async Task<string> GenerateRefreshToken(User user)
    {
        var refreshTokenValue = Guid.NewGuid().ToString();
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow
        };
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
        return refreshTokenValue;
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
        var user = await _context.Users.FirstOrDefaultAsync(X => X.Id == searchToken.UserId);
        if (user == null)
        {
            throw new Exception("user này không tồn tại");
        }
        searchToken.IsRevoked = true;
        searchToken.RevokedAt = DateTime.UtcNow;
        var newAccessToken = GenerateAccessToken(user);
        var newRefreshTokenValue = Guid.NewGuid().ToString();
        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenValue,
            ExpiresAt = searchToken.ExpiresAt,
            CreatedAt = DateTime.UtcNow
        };
        await _context.RefreshTokens.AddAsync(newRefreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes),
        };
    }
}