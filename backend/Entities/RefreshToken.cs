using System.ComponentModel.DataAnnotations.Schema;

public class RefreshToken
{
    public long Id{get;set;}
    [Column("user_id")]
    public long UserId{get;set;}
    public User User { get; set; } = null!;
    public string TokenHash{get;set;}
    public DateTime ExpiresAt{get;set;}
    public bool IsRevoked{get;set;}
    public DateTime? RevokedAt{get;set;}
    public string? DeviceInfo{get;set;}
    public string? IpAddress{get;set;}
    public DateTime CreatedAt{get;set;} 
    public virtual Session Session { get; set; }   
}