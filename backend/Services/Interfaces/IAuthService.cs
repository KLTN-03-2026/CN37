using Google.Apis.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task LogOutAsync(LogOutRequest request);
    Task<AuthResponse> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload);
}