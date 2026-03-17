public class UserProfile
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string FullName { get; set; }
    public string Avatar { get; set; }
    public string Phone { get; set; }
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } 
}