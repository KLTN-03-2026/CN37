public class InventoryExportItemBatch
{
    public long Id { get; set; }

    public long ExportItemId { get; set; }

    public long BatchId { get; set; }

    public int Quantity { get; set; }

    public decimal CostPrice { get; set; }

    public InventoryExportItem ExportItem { get; set; }

    public InventoryBatch Batch { get; set; }
}