using System.ComponentModel.DataAnnotations.Schema;

public class UserProfile
{
    public long Id { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public string? FullName { get; set; }
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Gender { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public User? User { get; set; } 
}