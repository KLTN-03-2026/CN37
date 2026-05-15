using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductEmbedding
{
    [Key]
    public long ProductId { get; set; }

    public string? Embedding { get; set; } // Stored as JSON string

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // 🔗 Navigation
    public Product? Product { get; set; }
}
