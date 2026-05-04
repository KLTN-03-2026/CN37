using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; }

    [MaxLength(255)]
    public string? Slug { get; set; }

    [Required]
    public long CategoryId { get; set; }

    [MaxLength(100)]
    public string? Brand { get; set; }

    public string? Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(12,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? DiscountPrice { get; set; }

    [MaxLength(500)]
    public string? Thumbnail { get; set; }

    [Column(TypeName = "decimal(3,2)")]
    public decimal RatingAvg { get; set; } = 0;

    public int RatingCount { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreateAt { get; set; } = DateTime.Now;

    public DateTime UpdateAt { get; set; } = DateTime.Now;

    // 🔗 Navigation
    public Category Category { get; set; }

    public ICollection<ProductImage> Images { get; set; }

    public ICollection<ProductSpecification> Specifications { get; set; }
    public ICollection<CartItem> CartItems { get; set; }
    public Inventory Inventory { get; set; }
    public ICollection<InventoryLog> InventoryLogs { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}