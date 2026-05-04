using System.ComponentModel.DataAnnotations.Schema;

public class EmailVerificationToken
{
    public long Id { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}