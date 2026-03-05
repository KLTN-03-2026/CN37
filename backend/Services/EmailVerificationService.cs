using BCrypt.Net;

public class EmailVerificationService : IEmailVerificationService
{
    private readonly AppDbContext _context;
    private readonly IEmailSender _emailSender;
    public EmailVerificationService(AppDbContext context, IEmailSender emailSender)
    {
        _context = context;
        _emailSender = emailSender;
    }

    public async Task SendVerificationEmailAsync(User user)
    {
        var rawToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        var token = BCrypt.Net.BCrypt.HashPassword(rawToken);
        var verificationToken = new EmailVerificationToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };
        await _context.EmailVerificationTokens.AddAsync(verificationToken);
        await _context.SaveChangesAsync();

        var verificationLink = $"http://localhost:3000/verify-email?token={Uri.EscapeDataString(rawToken)}";

        await _emailSender.SendEmailAsync(user.Email, "Verify Your Email", $"Please verify your email by clicking the following link: {verificationLink}");
    }

    public async Task VerifyEmailTokenAsync(string token)
    {
        var tokens = _context.EmailVerificationTokens.Where(t => !t.IsUsed && t.ExpiresAt > DateTime.UtcNow).ToList();
        var matchingToken = tokens.FirstOrDefault(x => BCrypt.Net.BCrypt.Verify(token, x.Token));
        if (matchingToken == null)
        {
            throw new Exception("Invalid or expired token.");
        }
        var user = await _context.Users.FindAsync(matchingToken.UserId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }
        user.EmailVerified = true;
        user.EmailVerifiedAt = DateTime.UtcNow;
        matchingToken.IsUsed = true;
        await _context.SaveChangesAsync();
    }
}