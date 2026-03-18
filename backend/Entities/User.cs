public class User
{
    public long Id{ get; set;}
    public string Email { get; set;}
    public string? PasswordHash { get; set;}
    public bool IsActive { get; set;} = true;
    public bool EmailVerified { get; set;} = false;
    public DateTime? EmailVerifiedAt { get; set;}
    public DateTime CreatedAt { get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set;} = DateTime.UtcNow;
}