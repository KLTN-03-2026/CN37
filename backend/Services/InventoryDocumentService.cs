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
        var now = DateTime.Now;

        var import = new InventoryImport
        {
            Code = GenerateCode("IMP"),
            SupplierId = request.SupplierId,
            Note = request.Note,
            CreatedBy = userId,
            CreatedAt = now,
            ApprovedAt = now,
            Status = "COMPLETED"
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
                Price = item.Price,
                TotalCost = item.Price * item.Quantity
            };

            _context.InventoryImportItems.Add(importItem);
            await _context.SaveChangesAsync();

            _context.InventoryBatches.Add(new InventoryBatch
            {
                ProductId = item.ProductId,
                ImportItemId = importItem.Id,
                OriginalQuantity = item.Quantity,
                RemainingQuantity = item.Quantity,
                CostPrice = item.Price,
                CreatedAt = now
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
                CreateAt = now,
                Price = item.Price
            });

            total += item.Quantity * item.Price;
        }

        import.TotalAmount = total;

        await _context.SaveChangesAsync();

        return import.Id;
    }

    private async Task<long> CreateExportInternal(CreateExportRequest request, long userId)
    {
        var now = DateTime.Now;

        var export = new InventoryExport
        {
            Code = GenerateCode("EXP"),
            ExportType = request.ExportType,
            ReferenceId = request.ReferenceId,
            Note = request.Note,
            CreatedBy = userId,
            CreatedAt = now,
            Status = request.Status ?? "COMPLETED",
            ApprovedAt = request.Status == "COMPLETED" ? now : null
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

            var exportItem = new InventoryExportItem
            {
                ExportId = export.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price,
                TotalAmount = item.Price * item.Quantity
            };

            _context.InventoryExportItems.Add(exportItem);
            await _context.SaveChangesAsync();

            int remainingToExport = item.Quantity;

            decimal totalCost = 0;

            var batches = await _context.InventoryBatches
                .Where(x =>
                    x.ProductId == item.ProductId &&
                    x.RemainingQuantity > 0)
                .OrderBy(x => x.CreatedAt)
                .ThenBy(x => x.Id)
                .ToListAsync();

            foreach (var batch in batches)
            {
                if (remainingToExport <= 0)
                    break;

                int takeQuantity = Math.Min(
                    batch.RemainingQuantity,
                    remainingToExport);

                batch.RemainingQuantity -= takeQuantity;

                remainingToExport -= takeQuantity;

                totalCost += takeQuantity * batch.CostPrice;

                _context.InventoryExportItemBatches.Add(
                    new InventoryExportItemBatch
                    {
                        ExportItemId = exportItem.Id,
                        BatchId = batch.Id,
                        Quantity = takeQuantity,
                        CostPrice = batch.CostPrice
                    });
            }

            if (remainingToExport > 0)
                throw new Exception(
                    $"Không đủ batch tồn kho cho product {item.ProductId}");

            decimal averageCost = item.Quantity > 0
                ? totalCost / item.Quantity
                : 0;

            exportItem.CostPrice = averageCost;

            _context.InventoryLogs.Add(new InventoryLog
            {
                ProductId = item.ProductId,
                ChangeType = "EXPORT",
                QuantityChanged = -item.Quantity,
                QuantityBefore = before,
                QuantityAfter = inventory.Quantity,
                ReferenceId = $"EXP_{export.Id}",
                Note = request.Note,
                CreateAt = now,
                Price = averageCost
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