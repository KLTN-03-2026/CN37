using Microsoft.AspNetCore.Routing.Constraints;

public class InventoryLog
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public int QuantityChanged { get; set; }
    public int QuantityBefore { get; set; }
    public int QuantityAfter { get; set; }
    public DateTime CreateAt { get; set; }
    public string? Note { get; set; }
    public string? ChangeType { get; set; } // e.g., "Addition", "Subtraction", "Adjustment"

    public string? ReferenceId { get; set; }

    public decimal Price { get; set; }

    public decimal Total { get; set; }

    // Navigation property
    public Product? Product { get; set; }
}
