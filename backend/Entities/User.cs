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
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public ICollection<UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
}