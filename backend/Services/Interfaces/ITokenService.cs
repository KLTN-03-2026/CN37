public interface ITokenService
{
    string GenerateAccessToken(User user);
    Task<string> GenerateRefreshToken(User user);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
}