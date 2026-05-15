using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AiChatMessage
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long SessionId { get; set; }

    [MaxLength(20)]
    public string? Role { get; set; } // user / assistant

    public string? Message { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // 🔗 Navigation
    [ForeignKey(nameof(SessionId))]
    public AiChatSession Session { get; set; } = null!;
}