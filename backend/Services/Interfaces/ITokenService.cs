public interface ITokenService
{
    string GenerateAccessToken(User user);
    Task<string> GenerateRefreshToken(User user, string deviceInfo, string ip);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task <List<SessionResponse>> GetSessionsAsync(long userId, string currentRefreshToken);
    Task<bool> LogoutSessionAsync(long userId, long sessionId);
}