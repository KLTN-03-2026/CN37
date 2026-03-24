using System.ComponentModel.DataAnnotations;

public class ProductSpecification
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long ProductId { get; set; }

    [MaxLength(255)]
    public string SpecName { get; set; }

    [MaxLength(255)]
    public string SpecValue { get; set; }

    // 🔗 Navigation
    public Product Product { get; set; }
}