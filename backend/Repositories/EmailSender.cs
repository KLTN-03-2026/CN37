using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

public class EmailSender : IEmailSender
{
    private readonly GmailOptions _gmailOption;
    public EmailSender(IOptions<GmailOptions> gmailOption)
    {
        _gmailOption = gmailOption.Value;
    }
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        MailMessage mailMessage = new MailMessage
        {
            From = new MailAddress(_gmailOption.Email),
        };
        mailMessage.To.Add(to);
        mailMessage.Subject = subject;
        mailMessage.Body = body;

        using var smtpClient = new SmtpClient();
        smtpClient.Host = _gmailOption.Host;
        smtpClient.Port = _gmailOption.Port;
        smtpClient.Credentials = new NetworkCredential(_gmailOption.Email,_gmailOption.Password);
        smtpClient.EnableSsl = true;
        await smtpClient.SendMailAsync(mailMessage);
    }
}