public class Session
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public User User { get; set; }

    public long RefreshTokenId { get; set; }
    public RefreshToken RefreshToken { get; set; }

    public string? DeviceInfo { get; set; }
    public string? IpAddress { get; set; }

    public DateTime LastActiveAt { get; set; }
    public DateTime CreateAt { get; set; }
}