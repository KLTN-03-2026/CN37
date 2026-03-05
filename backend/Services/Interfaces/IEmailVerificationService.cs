public interface IEmailVerificationService
{
    Task SendVerificationEmailAsync(User user);
    Task VerifyEmailTokenAsync(string token);
}