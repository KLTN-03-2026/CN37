using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductImage
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long ProductId { get; set; }

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; }

    public bool IsMain { get; set; } = false;

    public int SortOrder { get; set; } = 0;

    // 🔗 Navigation
    public Product Product { get; set; }
}