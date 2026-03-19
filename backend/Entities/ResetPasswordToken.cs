using System.ComponentModel.DataAnnotations.Schema;

public class ResetPasswordToken
{
    public long Id { get; set; }
    [Column("user_id")]
    public long UserId{get;set;}
    public string TokenHash { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; }
}