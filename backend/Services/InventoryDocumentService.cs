using Microsoft.EntityFrameworkCore;

public class InventoryDocumentService : IInventoryDocumentService
{
    private readonly AppDbContext _context;

    public InventoryDocumentService(AppDbContext context)
    {
        _context = context;
    }

    // ================= IMPORT =================
    public async Task<long> CreateImportAsync(CreateImportRequest request, long userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var import = new InventoryImport
            {
                Code = GenerateCode("IMP"),
                SupplierId = request.SupplierId,
                Note = request.Note,
                CreatedBy = userId,
                CreatedAt = DateTime.Now
            };

            _context.InventoryImports.Add(import);
            await _context.SaveChangesAsync();

            decimal total = 0;

            foreach (var item in request.Items)
            {
                var importItem = new InventoryImportItem
                {
                    ImportId = import.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    CostPrice = item.CostPrice
                };

                _context.InventoryImportItems.Add(importItem);

                // update inventory
                var inventory = await GetOrCreateInventory(item.ProductId);

                int before = inventory.Quantity;
                inventory.Quantity += item.Quantity;

                // log
                _context.InventoryLogs.Add(new InventoryLog
                {
                    ProductId = item.ProductId,
                    ChangeType = "IMPORT",
                    QuantityChanged = item.Quantity,
                    QuantityBefore = before,
                    QuantityAfter = inventory.Quantity,
                    ReferenceId = $"IMP_{import.Id}",
                    Note = "Nhập kho",
                    CreateAt = DateTime.Now
                });

                total += item.Quantity * item.CostPrice;
            }

            import.TotalAmount = total;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return import.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // ================= EXPORT =================
    public async Task<long> CreateExportAsync(CreateExportRequest request, long userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var export = new InventoryExport
            {
                Code = GenerateCode("EXP"),
                ExportType = request.ExportType,
                ReferenceId = request.ReferenceId,
                Note = request.Note,
                CreatedBy = userId,
                CreatedAt = DateTime.Now
            };

            _context.InventoryExports.Add(export);
            await _context.SaveChangesAsync();

            decimal total = 0;

            foreach (var item in request.Items)
            {
                var inventory = await GetOrCreateInventory(item.ProductId);

                if (inventory.Quantity < item.Quantity)
                    throw new Exception($"Không đủ hàng cho product {item.ProductId}");

                int before = inventory.Quantity;
                inventory.Quantity -= item.Quantity;

                // lấy cost gần nhất (simple version)
                var lastImport = await _context.InventoryImportItems
                    .Where(x => x.ProductId == item.ProductId)
                    .OrderByDescending(x => x.Id)
                    .FirstOrDefaultAsync();

                decimal cost = lastImport?.CostPrice ?? 0;

                var exportItem = new InventoryExportItem
                {
                    ExportId = export.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    CostPrice = cost
                };

                _context.InventoryExportItems.Add(exportItem);

                // log
                _context.InventoryLogs.Add(new InventoryLog
                {
                    ProductId = item.ProductId,
                    ChangeType = "EXPORT",
                    QuantityChanged = -item.Quantity,
                    QuantityBefore = before,
                    QuantityAfter = inventory.Quantity,
                    ReferenceId = $"EXP_{export.Id}",
                    Note = "Xuất kho",
                    CreateAt = DateTime.Now
                });

                total += item.Quantity * item.Price;
            }

            export.TotalAmount = total;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return export.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
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

    private string GenerateCode(string prefix)
    {
        return $"{prefix}{DateTime.Now:yyyyMMddHHmmss}";
    }
}