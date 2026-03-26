using Google.Apis.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request, string ip);
    Task LogOutAsync(LogOutRequest request);
    Task<AuthResponse> HandleGoogleLogin(GoogleJsonWebSignature.Payload payload, string deviceInfo, string ip);
    Task ForgotPasswordAsync(ForgotPasswordRequest request);
    Task ResetPasswordAsync(ResetPasswordRequest request);
}