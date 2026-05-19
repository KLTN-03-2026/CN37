using ClosedXML.Excel;
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
    public async Task<byte[]> ExportInventoryExcelAsync()
    {
        var inventories = await _context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Select(p => new
    {
        ProductId = p.Id,
        ProductName = p.Name,

        CategoryName = p.Category != null
            ? p.Category.Name
            : "N/A",

        Quantity = _context.Inventories
            .Where(i => i.ProductId == p.Id)
            .Select(i => (int?)i.Quantity)
            .FirstOrDefault() ?? 0,

        CostPrice = _context.InventoryBatches
            .Where(b => b.ProductId == p.Id && b.RemainingQuantity > 0)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => (decimal?)b.CostPrice)
            .FirstOrDefault() ?? 0,

        LastUpdated = _context.Inventories
            .Where(i => i.ProductId == p.Id)
            .Select(i => (DateTime?)i.LastUpdated)
            .FirstOrDefault()
    })
    .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Quản lý kho");

        worksheet.Range("A1:G1").Merge();
        worksheet.Cell("A1").Value = "DANH SÁCH TỒN KHO";
        worksheet.Cell("A1").Style.Font.Bold = true;
        worksheet.Cell("A1").Style.Font.FontSize = 20;
        worksheet.Cell("A1").Style.Font.FontColor = XLColor.White;
        worksheet.Cell("A1").Style.Fill.BackgroundColor = XLColor.DarkGreen;
        worksheet.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        worksheet.Range("A2:G2").Merge();
        worksheet.Cell("A2").Value = $"Ngày xuất: {DateTime.Now:dd/MM/yyyy HH:mm}";
        worksheet.Cell("A2").Style.Font.Italic = true;
        worksheet.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

        int headerRow = 4;

        string[] headers =
        {
            "STT", "Tên sản phẩm", "Danh mục", "Giá gốc",
            "Tồn kho", "Trạng thái", "Cập nhật lần cuối"
        };

        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cell(headerRow, i + 1).Value = headers[i];
        }

        var headerRange = worksheet.Range($"A{headerRow}:G{headerRow}");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Font.FontColor = XLColor.White;
        headerRange.Style.Fill.BackgroundColor = XLColor.Green;
        headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        int row = headerRow + 1;
        int stt = 1;

        foreach (var item in inventories)
        {
            string status = item.Quantity == 0
                ? "Hết hàng"
                : item.Quantity < 5
                    ? "Sắp hết"
                    : "Còn hàng";

            worksheet.Cell(row, 1).Value = stt++;
            worksheet.Cell(row, 2).Value = item.ProductName ?? "N/A";
            worksheet.Cell(row, 3).Value = item.CategoryName ?? "N/A";
            worksheet.Cell(row, 4).Value = item.CostPrice;
            worksheet.Cell(row, 5).Value = item.Quantity;
            worksheet.Cell(row, 6).Value = status;
            worksheet.Cell(row, 7).Value = item.LastUpdated.HasValue
                ? item.LastUpdated.Value.ToString("dd/MM/yyyy HH:mm")
                : "Chưa cập nhật";
            var dataRange = worksheet.Range($"A{row}:G{row}");
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            if (row % 2 == 0)
            {
                dataRange.Style.Fill.BackgroundColor = XLColor.LightGray;
            }

            row++;
        }

        worksheet.Column(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(4).Style.NumberFormat.Format = "#,##0 VNĐ";
        worksheet.Column(5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        worksheet.Columns().AdjustToContents();
        worksheet.SheetView.FreezeRows(headerRow);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return stream.ToArray();
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