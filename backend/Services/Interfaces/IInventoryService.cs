public interface IInventoryService
{
    Task ImportStock(long productId, int quantity);
    Task ExportStock(long productId, int quantity);
    Task DeductStockWhenOrder(long productId, int quantity, long orderId);
    Task RestoreStockWhenCancel(long productId, int quantity, long orderId);
    Task<int> GetStock(long productId);
}