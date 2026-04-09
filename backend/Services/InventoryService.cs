using Microsoft.EntityFrameworkCore;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ImportStock(long productId, int quantity)
    {
        var inventory = await GetOrCreateInventory(productId);

        int before = inventory.Quantity;
        inventory.Quantity += quantity;

        await AddLog(productId, "IMPORT", quantity, before, inventory.Quantity, null, "Nhập kho");

        await _context.SaveChangesAsync();
    }

    public async Task ExportStock(long productId, int quantity)
    {
        var inventory = await GetOrCreateInventory(productId);

        if (inventory.Quantity < quantity)
            throw new Exception("Không đủ hàng");

        int before = inventory.Quantity;
        inventory.Quantity -= quantity;

        await AddLog(productId, "EXPORT", -quantity, before, inventory.Quantity, null, "Xuất kho");

        await _context.SaveChangesAsync();
    }

    public Task DeductStockWhenOrder(long productId, int quantity, long orderId)
    {
        throw new NotImplementedException();
    }

    public Task RestoreStockWhenCancel(long productId, int quantity, long orderId)
    {
        throw new NotImplementedException();
    }

    public async Task<int> GetStock(long productId)
    {
        var inventory = await _context.Inventories
            .FirstOrDefaultAsync(x => x.ProductId == productId);

        return inventory?.Quantity ?? 0;
    }

     // ================= PRIVATE =================
    private async Task<Inventory> GetOrCreateInventory(long productId)
    {
        var inventory = await _context.Inventories
            .FirstOrDefaultAsync(x => x.ProductId == productId);

        if (inventory == null)
        {
            inventory = new Inventory
            {
                ProductId = productId,
                Quantity = 0
            };

            _context.Inventories.Add(inventory);
            await _context.SaveChangesAsync();
        }

        return inventory;
    }

    private async Task AddLog(long productId, string type, int change,
        int before, int after, long? refId, string note)
    {
        _context.InventoryLogs.Add(new InventoryLog
        {
            ProductId = productId,
            ChangeType = type,
            QuantityChanged = change,
            QuantityBefore = before,
            QuantityAfter = after,
            // ReferenceId = refId,
            Note = note,
            CreateAt = DateTime.Now
        });

        await Task.CompletedTask;
    }
}