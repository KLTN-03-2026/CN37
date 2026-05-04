using System.ComponentModel.DataAnnotations.Schema;

public class Passkey
{
    public long Id { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public string CredentialId { get; set; } = null!;
    public string PublicKey { get; set; } = null!;
    public uint SignCount { get; set; }
    public string? DeviceName { get; set; }
    public DateTime CreateAt { get; set; } = DateTime.Now;
}