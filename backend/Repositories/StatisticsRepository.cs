using backend.DTOs.Statistics;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class StatisticsRepository : IStatisticsRepository
{
    private readonly AppDbContext _context;

    public StatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    #region Revenue Statistics

    public async Task<List<RevenueStatisticsDto>> GetRevenueByDayAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => oi.Order.CompletedAt.Value.Date)
            .Select(g => new RevenueStatisticsDto
            {
                Label = g.Key.ToString("yyyy-MM-dd"),
                Date = g.Key,
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                OrderCount = g.Select(oi => oi.OrderId).Distinct().Count(),
                AverageOrderValue = g.Select(oi => oi.OrderId).Distinct().Count() > 0
                    ? g.Sum(oi => oi.Price * oi.Quantity) / g.Select(oi => oi.OrderId).Distinct().Count()
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<RevenueStatisticsDto>> GetRevenueByWeekAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Week = GetWeekOfYear(oi.Order.CompletedAt.Value)
            })
            .Select(g => new RevenueStatisticsDto
            {
                Label = $"{g.Key.Year}-W{g.Key.Week}",
                Date = g.Min(oi => oi.Order.CompletedAt.Value),
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                OrderCount = g.Select(oi => oi.OrderId).Distinct().Count(),
                AverageOrderValue = g.Select(oi => oi.OrderId).Distinct().Count() > 0
                    ? g.Sum(oi => oi.Price * oi.Quantity) / g.Select(oi => oi.OrderId).Distinct().Count()
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<RevenueStatisticsDto>> GetRevenueByMonthAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Month = oi.Order.CompletedAt.Value.Month
            })
            .Select(g => new RevenueStatisticsDto
            {
                Label = $"{g.Key.Year}-{g.Key.Month:D2}",
                Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity),
                OrderCount = g.Select(oi => oi.OrderId).Distinct().Count(),
                AverageOrderValue = g.Select(oi => oi.OrderId).Distinct().Count() > 0
                    ? g.Sum(oi => oi.Price * oi.Quantity) / g.Select(oi => oi.OrderId).Distinct().Count()
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<RevenueStatisticsDto>> GetRevenueByQuarterAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Quarter = (oi.Order.CompletedAt.Value.Month - 1) / 3 + 1
            })
            .Select(g => new RevenueStatisticsDto
            {
                Label = $"{g.Key.Year}-Q{g.Key.Quarter}",
                Date = new DateTime(g.Key.Year, (g.Key.Quarter - 1) * 3 + 1, 1),
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity),
                OrderCount = g.Select(oi => oi.OrderId).Distinct().Count(),
                AverageOrderValue = g.Select(oi => oi.OrderId).Distinct().Count() > 0
                    ? g.Sum(oi => oi.Price * oi.Quantity) / g.Select(oi => oi.OrderId).Distinct().Count()
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<RevenueStatisticsDto>> GetRevenueByYearAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => oi.Order.CompletedAt.Value.Year)
            .Select(g => new RevenueStatisticsDto
            {
                Label = g.Key.ToString(),
                Date = new DateTime(g.Key, 1, 1),
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity),
                OrderCount = g.Select(oi => oi.OrderId).Distinct().Count(),
                AverageOrderValue = g.Select(oi => oi.OrderId).Distinct().Count() > 0
                    ? g.Sum(oi => oi.Price * oi.Quantity) / g.Select(oi => oi.OrderId).Distinct().Count()
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }


    public async Task<List<ImportCostStatisticsDto>> GetImportCostByDayAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.InventoryImportItems
            .AsNoTracking()
            .Where(imi => imi.Import.Status == "Hoàn tất" &&
                   imi.Import.ApprovedAt.HasValue &&
                   imi.Import.ApprovedAt.Value.Date >= fromDate.Date &&
                   imi.Import.ApprovedAt.Value.Date <= toDate.Date)
            .GroupBy(imi => imi.Import.ApprovedAt.Value.Date)
            .Select(g => new ImportCostStatisticsDto
            {
                Label = g.Key.ToString("yyyy-MM-dd"),
                Date = g.Key,
                TotalCost = g.Sum(imi => imi.Quantity * imi.Price),
                ImportCount = g.Select(imi => imi.ImportId).Distinct().Count(),
                TotalQuantity = g.Sum(imi => imi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ImportCostStatisticsDto>> GetImportCostByWeekAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.InventoryImportItems
            .AsNoTracking()
            .Where(imi => imi.Import.Status == "Hoàn tất" &&
                   imi.Import.ApprovedAt.HasValue &&
                   imi.Import.ApprovedAt.Value.Date >= fromDate.Date &&
                   imi.Import.ApprovedAt.Value.Date <= toDate.Date)
            .GroupBy(imi => new
            {
                Year = imi.Import.ApprovedAt.Value.Year,
                Week = GetWeekOfYear(imi.Import.ApprovedAt.Value)
            })
            .Select(g => new ImportCostStatisticsDto
            {
                Label = $"{g.Key.Year}-W{g.Key.Week}",
                Date = g.Min(imi => imi.Import.ApprovedAt.Value),
                TotalCost = g.Sum(imi => imi.Quantity * imi.Price),
                ImportCount = g.Select(imi => imi.ImportId).Distinct().Count(),
                TotalQuantity = g.Sum(imi => imi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ImportCostStatisticsDto>> GetImportCostByMonthAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.InventoryImportItems
            .AsNoTracking()
            .Where(imi => imi.Import.Status == "Hoàn tất" &&
                   imi.Import.ApprovedAt.HasValue &&
                   imi.Import.ApprovedAt.Value.Date >= fromDate.Date &&
                   imi.Import.ApprovedAt.Value.Date <= toDate.Date)
            .GroupBy(imi => new
            {
                Year = imi.Import.ApprovedAt.Value.Year,
                Month = imi.Import.ApprovedAt.Value.Month
            })
            .Select(g => new ImportCostStatisticsDto
            {
                Label = $"{g.Key.Year}-{g.Key.Month:D2}",
                Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                TotalCost = g.Sum(imi => imi.Quantity * imi.Price),
                ImportCount = g.Select(imi => imi.ImportId).Distinct().Count(),
                TotalQuantity = g.Sum(imi => imi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ImportCostStatisticsDto>> GetImportCostByQuarterAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.InventoryImportItems
            .AsNoTracking()
            .Where(imi => imi.Import.Status == "Hoàn tất" &&
                   imi.Import.ApprovedAt.HasValue &&
                   imi.Import.ApprovedAt.Value.Date >= fromDate.Date &&
                   imi.Import.ApprovedAt.Value.Date <= toDate.Date)
            .GroupBy(imi => new
            {
                Year = imi.Import.ApprovedAt.Value.Year,
                Quarter = (imi.Import.ApprovedAt.Value.Month - 1) / 3 + 1
            })
            .Select(g => new ImportCostStatisticsDto
            {
                Label = $"{g.Key.Year}-Q{g.Key.Quarter}",
                Date = new DateTime(g.Key.Year, (g.Key.Quarter - 1) * 3 + 1, 1),
                TotalCost = g.Sum(imi => imi.Quantity * imi.Price),
                ImportCount = g.Select(imi => imi.ImportId).Distinct().Count(),
                TotalQuantity = g.Sum(imi => imi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ImportCostStatisticsDto>> GetImportCostByYearAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.InventoryImportItems
            .AsNoTracking()
            .Where(imi => imi.Import.Status == "Hoàn tất" &&
                   imi.Import.ApprovedAt.HasValue &&
                   imi.Import.ApprovedAt.Value.Date >= fromDate.Date &&
                   imi.Import.ApprovedAt.Value.Date <= toDate.Date)
            .GroupBy(imi => imi.Import.ApprovedAt.Value.Year)
            .Select(g => new ImportCostStatisticsDto
            {
                Label = g.Key.ToString(),
                Date = new DateTime(g.Key, 1, 1),
                TotalCost = g.Sum(imi => imi.Quantity * imi.Price),
                ImportCount = g.Select(imi => imi.ImportId).Distinct().Count(),
                TotalQuantity = g.Sum(imi => imi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    #endregion

    #region Profit Statistics

    public async Task<List<ProfitStatisticsDto>> GetProfitByDayAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => oi.Order.CompletedAt.Value.Date)
            .Select(g => new ProfitStatisticsDto
            {
                Label = g.Key.ToString("yyyy-MM-dd"),
                Date = g.Key,
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = (g.Sum(oi => oi.Price * oi.Quantity) > 0)
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ProfitStatisticsDto>> GetProfitByWeekAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Week = GetWeekOfYear(oi.Order.CompletedAt.Value)
            })
            .Select(g => new ProfitStatisticsDto
            {
                Label = $"{g.Key.Year}-W{g.Key.Week}",
                Date = g.Min(oi => oi.Order.CompletedAt.Value),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = (g.Sum(oi => oi.Price * oi.Quantity) > 0)
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ProfitStatisticsDto>> GetProfitByMonthAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Month = oi.Order.CompletedAt.Value.Month
            })
            .Select(g => new ProfitStatisticsDto
            {
                Label = $"{g.Key.Year}-{g.Key.Month:D2}",
                Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = (g.Sum(oi => oi.Price * oi.Quantity) > 0)
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ProfitStatisticsDto>> GetProfitByQuarterAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => new
            {
                Year = oi.Order.CompletedAt.Value.Year,
                Quarter = (oi.Order.CompletedAt.Value.Month - 1) / 3 + 1
            })
            .Select(g => new ProfitStatisticsDto
            {
                Label = $"{g.Key.Year}-Q{g.Key.Quarter}",
                Date = new DateTime(g.Key.Year, (g.Key.Quarter - 1) * 3 + 1, 1),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = (g.Sum(oi => oi.Price * oi.Quantity) > 0)
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    public async Task<List<ProfitStatisticsDto>> GetProfitByYearAsync(DateTime fromDate, DateTime toDate)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date >= fromDate.Date &&
                   oi.Order.CompletedAt.Value.Date <= toDate.Date)
            .GroupBy(oi => oi.Order.CompletedAt.Value.Year)
            .Select(g => new ProfitStatisticsDto
            {
                Label = g.Key.ToString(),
                Date = new DateTime(g.Key, 1, 1),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = (g.Sum(oi => oi.Price * oi.Quantity) > 0)
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return result;
    }

    #endregion

    #region Product Analytics

    public async Task<List<ProductAnalyticsDto>> GetProductAnalyticsAsync(int pageNumber = 1, int pageSize = 50)
    {
        var skip = (pageNumber - 1) * pageSize;

        var result = await _context.Products
            .AsNoTracking()
            .Join(
                _context.OrderItems.Where(oi => oi.Order.Status == "Hoàn tất"),
                p => p.Id,
                oi => oi.ProductId,
                (p, oi) => new { Product = p, OrderItem = oi }
            )
            .GroupBy(x => new
            {
                ProductId = x.Product.Id,
                ProductName = x.Product.Name,
                CategoryName = x.Product.Category.Name
            })
            .Select(g => new ProductAnalyticsDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                TotalSoldQuantity = g.Sum(x => x.OrderItem.Quantity),
                TotalRevenue = g.Sum(x => x.OrderItem.Price * x.OrderItem.Quantity),
                TotalCost = g.Sum(x => x.OrderItem.Price * x.OrderItem.Quantity),
                TotalProfit = g.Sum(x => (x.OrderItem.Price - x.OrderItem.Price) * x.OrderItem.Quantity),
                ProfitMarginPercentage = g.Sum(x => x.OrderItem.Price * x.OrderItem.Quantity) > 0
                    ? (g.Sum(x => (x.OrderItem.Price - x.OrderItem.Price) * x.OrderItem.Quantity) / g.Sum(x => x.OrderItem.Price * x.OrderItem.Quantity)) * 100
                    : 0,
                AverageSoldPrice = g.Count() > 0 ? g.Average(x => x.OrderItem.Price) : 0,
                AveragePrice = g.Count() > 0 ? g.Average(x => x.OrderItem.Price) : 0
            })
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        // Get inventory for each product
        foreach (var product in result)
        {
            var inventory = await _context.Inventories
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.ProductId == product.ProductId);

            product.CurrentInventoryQuantity = inventory?.Quantity ?? 0;
        }

        return result;
    }

    public async Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return null;

        var analytics = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.ProductId == productId && oi.Order.Status == "Hoàn tất")
            .GroupBy(oi => new { oi.Product.Name })
            .Select(g => new ProductAnalyticsDto
            {
                ProductId = productId,
                ProductName = g.Key.Name,
                Category = product.Category.Name,
                TotalSoldQuantity = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                TotalCost = g.Sum(oi => oi.Price * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProfitMarginPercentage = g.Sum(oi => oi.Price * oi.Quantity) > 0
                    ? (g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity)) * 100
                    : 0,
                AverageSoldPrice = g.Average(oi => oi.Price),
                AveragePrice = g.Average(oi => oi.Price)
            })
            .FirstOrDefaultAsync();

        if (analytics != null)
        {
            var inventory = await _context.Inventories
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.ProductId == productId);

            analytics.CurrentInventoryQuantity = inventory?.Quantity ?? 0;
        }

        return analytics;
    }

    public async Task<List<ProductAnalyticsDto>> GetLowStockProductsAsync(int threshold = 50)
    {
        var result = await _context.Inventories
            .AsNoTracking()
            .Where(i => i.Quantity <= threshold)
            .Select(i => new ProductAnalyticsDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Category = i.Product.Category.Name,
                CurrentInventoryQuantity = i.Quantity
            })
            .ToListAsync();

        return result;
    }

    #endregion

    #region Top Products

    public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount = 10)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất")
            .GroupBy(oi => new
            {
                ProductId = oi.Product.Id,
                ProductName = oi.Product.Name,
                CategoryName = oi.Product.Category.Name
            })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                Value = g.Sum(oi => oi.Price * oi.Quantity),
                Quantity = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.Quantity)
            .Take(topCount)
            .ToListAsync();

        return result;
    }

    public async Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount = 10)
    {
        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất")
            .GroupBy(oi => new
            {
                ProductId = oi.Product.Id,
                ProductName = oi.Product.Name,
                CategoryName = oi.Product.Category.Name
            })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                Value = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                Quantity = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.Value)
            .Take(topCount)
            .ToListAsync();

        return result;
    }

    #endregion

    #region Dashboard Summary

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var today = DateTime.Now.Date;
        var yesterday = today.AddDays(-1);
        var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
        var firstDayOfLastMonth = firstDayOfMonth.AddMonths(-1);

        // Today's revenue and profit
        var todayStats = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date == today)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity)
            })
            .FirstOrDefaultAsync();

        // Yesterday's revenue and profit
        var yesterdayStats = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value.Date == yesterday)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity)
            })
            .FirstOrDefaultAsync();

        // Current month revenue and profit
        var currentMonthStats = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value >= firstDayOfMonth &&
                   oi.Order.CompletedAt.Value.Date <= today)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity)
            })
            .FirstOrDefaultAsync();

        // Previous month revenue and profit
        var previousMonthStats = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value >= firstDayOfLastMonth &&
                   oi.Order.CompletedAt.Value < firstDayOfMonth)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity)
            })
            .FirstOrDefaultAsync();

        // Order counts
        var totalOrders = await _context.Orders.CountAsync();
        var completedOrders = await _context.Orders.CountAsync(o => o.Status == "Hoàn tất");
        var cancelledOrders = await _context.Orders.CountAsync(o => o.Status == "CANCELLED");
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status != "Hoàn tất" && o.Status != "CANCELLED");

        // Top products
        var topSelling = await GetTopSellingProductsAsync(10);
        var topProfit = await GetTopProfitProductsAsync(10);

        // Low stock products
        var lowStockCount = await _context.Inventories
            .AsNoTracking()
            .CountAsync(i => i.Quantity <= 50);

        var summary = new DashboardSummaryDto
        {
            TodayRevenue = todayStats?.Revenue ?? 0,
            TodayProfit = todayStats?.Profit ?? 0,
            TodayRevenuePreviousDay = yesterdayStats?.Revenue ?? 0,
            TodayProfitPreviousDay = yesterdayStats?.Profit ?? 0,

            TotalOrders = totalOrders,
            CompletedOrders = completedOrders,
            CancelledOrders = cancelledOrders,
            PendingOrders = pendingOrders,

            MonthlyRevenue = currentMonthStats?.Revenue ?? 0,
            MonthlyProfit = currentMonthStats?.Profit ?? 0,
            MonthlyRevenuePreviousMonth = previousMonthStats?.Revenue ?? 0,
            MonthlyProfitPreviousMonth = previousMonthStats?.Profit ?? 0,

            TopSellingProducts = topSelling,
            TopProfitProducts = topProfit,
            TotalLowStockProducts = lowStockCount,

            RevenueGrowthPercentage = (currentMonthStats?.Revenue ?? 0) > 0 && (previousMonthStats?.Revenue ?? 0) > 0
                ? (((currentMonthStats.Revenue - previousMonthStats.Revenue) / previousMonthStats.Revenue) * 100)
                : 0,
            ProfitGrowthPercentage = (currentMonthStats?.Profit ?? 0) > 0 && (previousMonthStats?.Profit ?? 0) > 0
                ? (((currentMonthStats.Profit - previousMonthStats.Profit) / previousMonthStats.Profit) * 100)
                : 0
        };

        return summary;
    }

    #endregion

    #region Category Analytics

    public async Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(DateTime? fromDate = null, DateTime? toDate = null)
    {
        fromDate ??= DateTime.Now.AddMonths(-1);
        toDate ??= DateTime.Now;

        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value >= fromDate &&
                   oi.Order.CompletedAt.Value <= toDate)
            .GroupBy(oi => new { oi.Product.Category.Id, oi.Product.Category.Name })
            .Select(g => new
            {
                CategoryId = g.Key.Id,
                CategoryName = g.Key.Name,
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                ProductCount = g.Select(oi => oi.ProductId).Distinct().Count(),
                TotalQuantitySold = g.Sum(oi => oi.Quantity)
            })
            .ToListAsync();

        var totalRevenue = result.Sum(r => r.Revenue);

        return result
            .Select(r => new CategoricalRevenueDto
            {
                CategoryId = r.CategoryId,
                CategoryName = r.CategoryName,
                Revenue = r.Revenue,
                Profit = r.Profit,
                ProductCount = r.ProductCount,
                TotalQuantitySold = r.TotalQuantitySold,
                PercentageOfTotal = totalRevenue > 0 ? (r.Revenue / totalRevenue) * 100 : 0
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();
    }

    #endregion

    #region Comparison

    public async Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync()
    {
        var today = DateTime.Now;
        var currentMonthStart = new DateTime(today.Year, today.Month, 1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = currentMonthStart.AddDays(-1);

        var currentMonthData = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value >= currentMonthStart)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                Orders = g.Select(oi => oi.OrderId).Distinct().Count()
            })
            .FirstOrDefaultAsync();

        var previousMonthData = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == "Hoàn tất" &&
                   oi.Order.CompletedAt.HasValue &&
                   oi.Order.CompletedAt.Value >= previousMonthStart &&
                   oi.Order.CompletedAt.Value <= previousMonthEnd)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                Orders = g.Select(oi => oi.OrderId).Distinct().Count()
            })
            .FirstOrDefaultAsync();

        var currentRevenue = currentMonthData?.Revenue ?? 0;
        var previousRevenue = previousMonthData?.Revenue ?? 0;
        var currentProfit = currentMonthData?.Profit ?? 0;
        var previousProfit = previousMonthData?.Profit ?? 0;

        return new ComparisonStatisticsDto
        {
            Label = $"{currentMonthStart.Year}-{currentMonthStart.Month:D2}",
            CurrentPeriodRevenue = currentRevenue,
            PreviousPeriodRevenue = previousRevenue,
            RevenueChange = currentRevenue - previousRevenue,
            RevenueChangePercentage = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,

            CurrentPeriodProfit = currentProfit,
            PreviousPeriodProfit = previousProfit,
            ProfitChange = currentProfit - previousProfit,
            ProfitChangePercentage = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0,

            CurrentPeriodOrders = currentMonthData?.Orders ?? 0,
            PreviousPeriodOrders = previousMonthData?.Orders ?? 0
        };
    }

    public async Task<List<ComparisonStatisticsDto>> CompareCurrentVsPreviousYearAsync()
    {
        var result = new List<ComparisonStatisticsDto>();
        var today = DateTime.Now;
        var currentYear = today.Year;
        var previousYear = currentYear - 1;

        for (int month = 1; month <= 12; month++)
        {
            var currentMonthStart = new DateTime(currentYear, month, 1);
            var currentMonthEnd = currentMonthStart.AddMonths(1).AddDays(-1);
            var previousMonthStart = new DateTime(previousYear, month, 1);
            var previousMonthEnd = previousMonthStart.AddMonths(1).AddDays(-1);

            var currentMonthData = await _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.Order.Status == "Hoàn tất" &&
                       oi.Order.CompletedAt.HasValue &&
                       oi.Order.CompletedAt.Value >= currentMonthStart &&
                       oi.Order.CompletedAt.Value <= currentMonthEnd)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                    Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                    Orders = g.Select(oi => oi.OrderId).Distinct().Count()
                })
                .FirstOrDefaultAsync();

            var previousMonthData = await _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.Order.Status == "Hoàn tất" &&
                       oi.Order.CompletedAt.HasValue &&
                       oi.Order.CompletedAt.Value >= previousMonthStart &&
                       oi.Order.CompletedAt.Value <= previousMonthEnd)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                    Profit = g.Sum(oi => (oi.Price - oi.Price) * oi.Quantity),
                    Orders = g.Select(oi => oi.OrderId).Distinct().Count()
                })
                .FirstOrDefaultAsync();

            var currentRevenue = currentMonthData?.Revenue ?? 0;
            var previousRevenue = previousMonthData?.Revenue ?? 0;
            var currentProfit = currentMonthData?.Profit ?? 0;
            var previousProfit = previousMonthData?.Profit ?? 0;

            result.Add(new ComparisonStatisticsDto
            {
                Label = $"{month:D2}",
                CurrentPeriodRevenue = currentRevenue,
                PreviousPeriodRevenue = previousRevenue,
                RevenueChange = currentRevenue - previousRevenue,
                RevenueChangePercentage = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,

                CurrentPeriodProfit = currentProfit,
                PreviousPeriodProfit = previousProfit,
                ProfitChange = currentProfit - previousProfit,
                ProfitChangePercentage = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0,

                CurrentPeriodOrders = currentMonthData?.Orders ?? 0,
                PreviousPeriodOrders = previousMonthData?.Orders ?? 0
            });
        }

        return result;
    }

    #endregion

    #region Helper Methods

    private static int GetWeekOfYear(DateTime date)
    {
        var culture = System.Globalization.CultureInfo.CurrentCulture;
        var calendar = culture.Calendar;
        return calendar.GetWeekOfYear(date, culture.DateTimeFormat.CalendarWeekRule, DayOfWeek.Monday);
    }

    #endregion
}
