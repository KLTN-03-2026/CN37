public class InventoryExportItem
{
    public long Id { get; set; }

    public long ExportId { get; set; }
    public InventoryExport Export { get; set; }

    public long ProductId { get; set; }
    public Product Product { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;
    public decimal? CostPrice { get; set; }

    public decimal TotalAmount => Quantity * Price;
}