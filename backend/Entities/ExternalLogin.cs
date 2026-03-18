using System.ComponentModel.DataAnnotations.Schema;

public class ExternalLogin
{
    public long Id { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public string Provider { get; set; }
    public string ProviderUserId { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } 
}