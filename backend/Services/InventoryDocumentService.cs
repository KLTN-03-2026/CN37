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
        var hasTransaction = _context.Database.CurrentTransaction != null;

        if (!hasTransaction)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var result = await CreateImportInternal(request, userId);
                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        return await CreateImportInternal(request, userId);
    }
    // ================= EXPORT =================
    public async Task<long> CreateExportAsync(CreateExportRequest request, long userId)
    {
        var hasTransaction = _context.Database.CurrentTransaction != null;

        if (!hasTransaction)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var result = await CreateExportInternal(request, userId);
                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        return await CreateExportInternal(request, userId);
    }

    private async Task<long> CreateImportInternal(CreateImportRequest request, long userId)
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
            _context.InventoryImportItems.Add(new InventoryImportItem
            {
                ImportId = import.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                CostPrice = item.CostPrice
            });

            var inventory = await GetOrCreateInventory(item.ProductId);

            int before = inventory.Quantity;
            inventory.Quantity += item.Quantity;

            _context.InventoryLogs.Add(new InventoryLog
            {
                ProductId = item.ProductId,
                ChangeType = "IMPORT",
                QuantityChanged = item.Quantity,
                QuantityBefore = before,
                QuantityAfter = inventory.Quantity,
                ReferenceId = $"IMP_{import.Id}",
                Note = request.Note,
                CreateAt = DateTime.Now,
                Price = item.CostPrice,
            });

            total += item.Quantity * item.CostPrice;
        }

        import.TotalAmount = total;

        await _context.SaveChangesAsync();

        return import.Id;
    }

    private async Task<long> CreateExportInternal(CreateExportRequest request, long userId)
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

            var lastImport = await _context.InventoryImportItems
                .Where(x => x.ProductId == item.ProductId)
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            decimal cost = lastImport?.CostPrice ?? 0;

            _context.InventoryExportItems.Add(new InventoryExportItem
            {
                ExportId = export.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price,
                CostPrice = cost
            });

            _context.InventoryLogs.Add(new InventoryLog
            {
                ProductId = item.ProductId,
                ChangeType = "EXPORT",
                QuantityChanged = -item.Quantity,
                QuantityBefore = before,
                QuantityAfter = inventory.Quantity,
                ReferenceId = $"EXP_{export.Id}",
                Note = request.Note,
                CreateAt = DateTime.Now,
                Price = cost
            });

            total += item.Quantity * item.Price;
        }

        export.TotalAmount = total;

        await _context.SaveChangesAsync();

        return export.Id;
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
        }

        return inventory;
    }

    private string GenerateCode(string prefix)
    {
        return $"{prefix}{DateTime.Now:yyyyMMddHHmmss}";
    }
}