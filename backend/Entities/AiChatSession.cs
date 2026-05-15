using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AiChatSession
{
    [Key]
    public long Id { get; set; }

    public long? UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // 🔗 Navigation
    public User? User { get; set; }
    public ICollection<AiChatMessage> Messages { get; set; } = new List<AiChatMessage>();
}
