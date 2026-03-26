public class SessionResponse
{
    public long SessionId { get; set; }
    public string Device { get; set; }
    public string Ip { get; set; }
    public DateTime LastActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsCurrent { get; set; }
}