public interface IEmailVerificationService
{
    Task SendVerificationEmailAsync(User user);
    Task VerifyEmailTokenAsync(string token);
    Task sendResetPasswordEmailAsync(User user);
    Task<ResetPasswordToken> VerifyResetPasswordTokenAsync(string token);
}