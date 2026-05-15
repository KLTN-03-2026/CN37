using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AiRecommendation
{
    [Key]
    public long Id { get; set; }

    public long? UserId { get; set; }

    public long? ProductId { get; set; }

    [Column(TypeName = "float")]
    public float? Score { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // 🔗 Navigation
    public User? User { get; set; }
    public Product? Product { get; set; }
}
