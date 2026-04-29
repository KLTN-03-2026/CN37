public class AuditLog
{
    public long Id { get; set; }
    public long? ActorUserId { get; set; }
    public long? TargetUserId { get; set; }
    public string Action { get; set; }
    public string Details { get; set; }
    public string IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}