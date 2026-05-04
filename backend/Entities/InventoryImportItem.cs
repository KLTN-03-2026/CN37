public class InventoryImportItem
{
    public long Id { get; set; }

    public long ImportId { get; set; }
    public InventoryImport Import { get; set; }

    public long ProductId { get; set; }
    public Product Product { get; set; }

    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }

    public decimal TotalCost => Quantity * CostPrice;
}