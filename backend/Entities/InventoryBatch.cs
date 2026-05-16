public class InventoryBatch
{
    public long Id { get; set; }

    public long ProductId { get; set; }

    public long ImportItemId { get; set; }

    public int OriginalQuantity { get; set; }

    public int RemainingQuantity { get; set; }

    public decimal CostPrice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Product Product { get; set; }

    public InventoryImportItem ImportItem { get; set; }

    public ICollection<InventoryExportItemBatch> ExportItemBatches { get; set; }
        = new List<InventoryExportItemBatch>();
}