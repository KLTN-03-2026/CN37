using backend.DTOs.Statistics;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace backend.Repositories;

public class StatisticsRepository : IStatisticsRepository
{
    private readonly AppDbContext _context;
    private const string CompletedStatus = "Hoàn tất";
    private const string CancelledStatus = "CANCELLED";

    public StatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    #region Revenue Statistics

    public async Task<List<BusinessStatisticsDto>> GetStatisticsByDayAsync(DateTime fromDate, DateTime toDate)
    {
        var startDate = fromDate.Date;
        var endDate = toDate.Date.AddDays(1);

        var data = await _context.InventoryExportItems
            .AsNoTracking()
            .Where(x =>
                x.Export.ExportType == "ORDER" &&
                x.Export.Status == "COMPLETED" &&
                x.Export.ApprovedAt.HasValue &&
                x.Export.ApprovedAt.Value >= startDate &&
                x.Export.ApprovedAt.Value < endDate)
            .GroupBy(x => new
            {
                Year = x.Export.ApprovedAt.Value.Year,
                Month = x.Export.ApprovedAt.Value.Month,
                Day = x.Export.ApprovedAt.Value.Day
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                g.Key.Day,

                Revenue = g.Sum(x => x.Price * x.Quantity),

                Cost = g.SelectMany(x => x.ExportItemBatches)
                    .Sum(b => b.CostPrice * b.Quantity),

                ExportCount = g.Select(x => x.ExportId).Distinct().Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ThenBy(x => x.Day)
            .ToListAsync();

        return data.Select(x =>
        {
            var profit = x.Revenue - x.Cost;

            return new BusinessStatisticsDto
            {
                Label = $"{x.Year}-{x.Month:D2}-{x.Day:D2}",
                Date = new DateTime(x.Year, x.Month, x.Day),
                Revenue = x.Revenue,
                Cost = x.Cost,
                Profit = profit,
                ExportCount = x.ExportCount
            };
        }).ToList();
    }

    public async Task<List<BusinessStatisticsDto>> GetStatisticsByMonthAsync(DateTime fromDate, DateTime toDate)
    {
        var startDate = fromDate.Date;
        var endDate = toDate.Date.AddDays(1);

        var data = await _context.InventoryExportItems
            .AsNoTracking()
            .Where(x =>
                x.Export.ExportType == "ORDER" &&
                x.Export.Status == "COMPLETED" &&
                x.Export.ApprovedAt.HasValue &&
                x.Export.ApprovedAt.Value >= startDate &&
                x.Export.ApprovedAt.Value < endDate)
            .GroupBy(x => new
            {
                Year = x.Export.ApprovedAt.Value.Year,
                Month = x.Export.ApprovedAt.Value.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,

                Revenue = g.Sum(x => x.Price * x.Quantity),

                Cost = g.SelectMany(x => x.ExportItemBatches)
                    .Sum(b => b.CostPrice * b.Quantity),

                ExportCount = g.Select(x => x.ExportId).Distinct().Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        return data.Select(x =>
        {
            var profit = x.Revenue - x.Cost;

            return new BusinessStatisticsDto
            {
                Label = $"{x.Year}-{x.Month:D2}",
                Date = new DateTime(x.Year, x.Month, 1),
                Revenue = x.Revenue,
                Cost = x.Cost,
                Profit = profit,
                ExportCount = x.ExportCount
            };
        }).ToList();
    }

    public async Task<List<BusinessStatisticsDto>> GetStatisticsByQuarterAsync(DateTime fromDate, DateTime toDate)
    {
        var startDate = fromDate.Date;
        var endDate = toDate.Date.AddDays(1);

        var data = await _context.InventoryExportItems
            .AsNoTracking()
            .Where(x =>
                x.Export.ExportType == "ORDER" &&
                x.Export.Status == "COMPLETED" &&
                x.Export.ApprovedAt.HasValue &&
                x.Export.ApprovedAt.Value >= startDate &&
                x.Export.ApprovedAt.Value < endDate)
            .GroupBy(x => new
            {
                Year = x.Export.ApprovedAt.Value.Year,
                Quarter = ((x.Export.ApprovedAt.Value.Month - 1) / 3) + 1
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Quarter,

                Revenue = g.Sum(x => x.Price * x.Quantity),

                Cost = g.SelectMany(x => x.ExportItemBatches)
                    .Sum(b => b.CostPrice * b.Quantity),

                ExportCount = g.Select(x => x.ExportId).Distinct().Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Quarter)
            .ToListAsync();

        return data.Select(x =>
        {
            var profit = x.Revenue - x.Cost;
            var firstMonthOfQuarter = ((x.Quarter - 1) * 3) + 1;

            return new BusinessStatisticsDto
            {
                Label = $"{x.Year}-Q{x.Quarter}",
                Date = new DateTime(x.Year, firstMonthOfQuarter, 1),
                Revenue = x.Revenue,
                Cost = x.Cost,
                Profit = profit,
                ExportCount = x.ExportCount
            };
        }).ToList();
    }

    public async Task<List<BusinessStatisticsDto>> GetStatisticsByYearAsync(DateTime fromDate, DateTime toDate)
    {
        var startDate = fromDate.Date;
        var endDate = toDate.Date.AddDays(1);

        var data = await _context.InventoryExportItems
            .AsNoTracking()
            .Where(x =>
                x.Export.ExportType == "ORDER" &&
                x.Export.Status == "COMPLETED" &&
                x.Export.ApprovedAt.HasValue &&
                x.Export.ApprovedAt.Value >= startDate &&
                x.Export.ApprovedAt.Value < endDate)
            .GroupBy(x => x.Export.ApprovedAt.Value.Year)
            .Select(g => new
            {
                Year = g.Key,

                Revenue = g.Sum(x => x.Price * x.Quantity),

                Cost = g.SelectMany(x => x.ExportItemBatches)
                    .Sum(b => b.CostPrice * b.Quantity),

                ExportCount = g.Select(x => x.ExportId).Distinct().Count()
            })
            .OrderBy(x => x.Year)
            .ToListAsync();

        return data.Select(x =>
        {
            var profit = x.Revenue - x.Cost;

            return new BusinessStatisticsDto
            {
                Label = x.Year.ToString(),
                Date = new DateTime(x.Year, 1, 1),
                Revenue = x.Revenue,
                Cost = x.Cost,
                Profit = profit,
                ExportCount = x.ExportCount
            };
        }).ToList();
    }

    #endregion

    #region Product Analytics

    public async Task<List<ProductAnalyticsDto>> GetProductAnalyticsAsync(int pageNumber = 1, int pageSize = 50)
    {
        var skip = (pageNumber - 1) * pageSize;

        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == CompletedStatus)
            .GroupBy(oi => new
            {
                ProductId = oi.Product.Id,
                ProductName = oi.Product.Name,
                CategoryName = oi.Product.Category.Name
            })
            .Select(g => new ProductAnalyticsDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                TotalSoldQuantity = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.Price * x.Quantity ?? 0),
                TotalCost = g.Sum(x => x.CostPrice * x.Quantity),
                TotalProfit = g.Sum(x => (x.Price - x.CostPrice) * x.Quantity ?? 0),
                ProfitMarginPercentage = g.Sum(x => x.Price * x.Quantity) > 0
                    ? (g.Sum(x => (x.Price - x.CostPrice) * x.Quantity) / g.Sum(x => x.Price * x.Quantity) ?? 0) * 100
                    : 0,
                AverageSoldPrice = g.Average(x => x.Price) ?? 0,
                AveragePrice = g.Average(x => x.Price) ?? 0
            })
            .OrderByDescending(x => x.TotalRevenue)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        var productIds = result.Select(x => x.ProductId).ToList();

        var inventories = await _context.Inventories
            .AsNoTracking()
            .Where(i => productIds.Contains(i.ProductId))
            .Select(i => new
            {
                i.ProductId,
                i.Quantity
            })
            .ToListAsync();

        foreach (var product in result)
        {
            product.CurrentInventoryQuantity =
                inventories.FirstOrDefault(i => i.ProductId == product.ProductId)?.Quantity ?? 0;
        }

        return result;
    }

    public async Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId)
    {
        var analytics = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.ProductId == productId && oi.Order.Status == CompletedStatus)
            .GroupBy(oi => new
            {
                ProductId = oi.Product.Id,
                ProductName = oi.Product.Name,
                CategoryName = oi.Product.Category.Name
            })
            .Select(g => new ProductAnalyticsDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                TotalSoldQuantity = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity) ?? 0,
                TotalCost = g.Sum(oi => oi.CostPrice * oi.Quantity),
                TotalProfit = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity) ?? 0,
                ProfitMarginPercentage = g.Sum(oi => oi.Price * oi.Quantity) > 0
                    ? (g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity) / g.Sum(oi => oi.Price * oi.Quantity) ?? 0) * 100
                    : 0,
                AverageSoldPrice = g.Average(oi => oi.Price) ?? 0,
                AveragePrice = g.Average(oi => oi.Price) ?? 0
            })
            .FirstOrDefaultAsync();

        if (analytics == null)
        {
            var product = await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == productId)
                .Select(p => new ProductAnalyticsDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    Category = p.Category.Name,
                    TotalSoldQuantity = 0,
                    TotalRevenue = 0,
                    TotalCost = 0,
                    TotalProfit = 0,
                    ProfitMarginPercentage = 0,
                    AverageSoldPrice = 0,
                    AveragePrice = p.Price
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return null;

            analytics = product;
        }

        var inventory = await _context.Inventories
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.ProductId == productId);

        analytics.CurrentInventoryQuantity = inventory?.Quantity ?? 0;

        return analytics;
    }

    public async Task<List<ProductAnalyticsDto>> GetLowStockProductsAsync(int threshold = 50)
    {
        return await _context.Inventories
            .AsNoTracking()
            .Where(i => i.Quantity <= threshold)
            .Select(i => new ProductAnalyticsDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Category = i.Product.Category.Name,
                CurrentInventoryQuantity = i.Quantity
            })
            .OrderBy(i => i.CurrentInventoryQuantity)
            .ToListAsync();
    }

    #endregion

    #region Top Products

    public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount = 10)
    {
        return await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == CompletedStatus)
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
                Value = g.Sum(oi => oi.Price * oi.Quantity ?? 0),
                Quantity = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.Quantity)
            .Take(topCount)
            .ToListAsync();
    }

    public async Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount = 10)
    {
        return await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.Status == CompletedStatus)
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
                Value = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity ?? 0),
                Quantity = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.Value)
            .Take(topCount)
            .ToListAsync();
    }

    #endregion

    #region Dashboard Summary

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var today = DateTime.Now.Date;
        var tomorrow = today.AddDays(1);
        var yesterday = today.AddDays(-1);
        var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
        var firstDayOfNextMonth = firstDayOfMonth.AddMonths(1);
        var firstDayOfLastMonth = firstDayOfMonth.AddMonths(-1);

        var todayStats = await GetSalesSummaryAsync(today, tomorrow);
        var yesterdayStats = await GetSalesSummaryAsync(yesterday, today);
        var currentMonthStats = await GetSalesSummaryAsync(firstDayOfMonth, firstDayOfNextMonth);
        var previousMonthStats = await GetSalesSummaryAsync(firstDayOfLastMonth, firstDayOfMonth);

        var totalOrders = await _context.Orders.CountAsync();
        var completedOrders = await _context.Orders.CountAsync(o => o.Status == CompletedStatus);
        var cancelledOrders = await _context.Orders.CountAsync(o => o.Status == CancelledStatus);
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status != CompletedStatus && o.Status != CancelledStatus);

        var topSelling = await GetTopSellingProductsAsync(10);
        var topProfit = await GetTopProfitProductsAsync(10);

        var lowStockCount = await _context.Inventories
            .AsNoTracking()
            .CountAsync(i => i.Quantity <= 50);

        return new DashboardSummaryDto
        {
            TodayRevenue = todayStats.Revenue,
            TodayProfit = todayStats.Profit,
            TodayRevenuePreviousDay = yesterdayStats.Revenue,
            TodayProfitPreviousDay = yesterdayStats.Profit,

            TotalOrders = totalOrders,
            CompletedOrders = completedOrders,
            CancelledOrders = cancelledOrders,
            PendingOrders = pendingOrders,

            MonthlyRevenue = currentMonthStats.Revenue,
            MonthlyProfit = currentMonthStats.Profit,
            MonthlyRevenuePreviousMonth = previousMonthStats.Revenue,
            MonthlyProfitPreviousMonth = previousMonthStats.Profit,

            TopSellingProducts = topSelling,
            TopProfitProducts = topProfit,
            TotalLowStockProducts = lowStockCount,

            RevenueGrowthPercentage = previousMonthStats.Revenue > 0
                ? ((currentMonthStats.Revenue - previousMonthStats.Revenue) / previousMonthStats.Revenue) * 100
                : 0,

            ProfitGrowthPercentage = previousMonthStats.Profit > 0
                ? ((currentMonthStats.Profit - previousMonthStats.Profit) / previousMonthStats.Profit) * 100
                : 0
        };
    }

    #endregion

    #region Category Analytics

    public async Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(DateTime? fromDate = null, DateTime? toDate = null)
    {
        var startDate = (fromDate ?? DateTime.Now.AddMonths(-1)).Date;
        var endDate = (toDate ?? DateTime.Now).Date.AddDays(1);

        var result = await _context.OrderItems
            .AsNoTracking()
            .Where(oi =>
                oi.Order.Status == CompletedStatus &&
                oi.Order.CompletedAt.HasValue &&
                oi.Order.CompletedAt.Value >= startDate &&
                oi.Order.CompletedAt.Value < endDate)
            .GroupBy(oi => new
            {
                CategoryId = oi.Product.Category.Id,
                CategoryName = oi.Product.Category.Name
            })
            .Select(g => new
            {
                g.Key.CategoryId,
                g.Key.CategoryName,
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Profit = g.Sum(oi => (oi.Price - oi.CostPrice) * oi.Quantity),
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
                Revenue = r.Revenue ?? 0,
                Profit = r.Profit ?? 0,
                ProductCount = r.ProductCount,
                TotalQuantitySold = r.TotalQuantitySold,
                PercentageOfTotal = (totalRevenue ?? 0) > 0 ? ((r.Revenue ?? 0) / (totalRevenue ?? 1)) * 100 : 0
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();
    }

    #endregion

    #region Comparison

    public async Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync()
    {
        var today = DateTime.Now.Date;
        var currentMonthStart = new DateTime(today.Year, today.Month, 1);
        var nextMonthStart = currentMonthStart.AddMonths(1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);

        var currentMonthData = await GetSalesSummaryWithOrdersAsync(currentMonthStart, nextMonthStart);
        var previousMonthData = await GetSalesSummaryWithOrdersAsync(previousMonthStart, currentMonthStart);

        return new ComparisonStatisticsDto
        {
            Label = $"{currentMonthStart.Year}-{currentMonthStart.Month:D2}",

            CurrentPeriodRevenue = currentMonthData.Revenue,
            PreviousPeriodRevenue = previousMonthData.Revenue,
            RevenueChange = currentMonthData.Revenue - previousMonthData.Revenue,
            RevenueChangePercentage = previousMonthData.Revenue > 0
                ? ((currentMonthData.Revenue - previousMonthData.Revenue) / previousMonthData.Revenue) * 100
                : 0,

            CurrentPeriodProfit = currentMonthData.Profit,
            PreviousPeriodProfit = previousMonthData.Profit,
            ProfitChange = currentMonthData.Profit - previousMonthData.Profit,
            ProfitChangePercentage = previousMonthData.Profit > 0
                ? ((currentMonthData.Profit - previousMonthData.Profit) / previousMonthData.Profit) * 100
                : 0,

            CurrentPeriodOrders = currentMonthData.Orders,
            PreviousPeriodOrders = previousMonthData.Orders
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
            var currentMonthEnd = currentMonthStart.AddMonths(1);

            var previousMonthStart = new DateTime(previousYear, month, 1);
            var previousMonthEnd = previousMonthStart.AddMonths(1);

            var currentMonthData = await GetSalesSummaryWithOrdersAsync(currentMonthStart, currentMonthEnd);
            var previousMonthData = await GetSalesSummaryWithOrdersAsync(previousMonthStart, previousMonthEnd);

            result.Add(new ComparisonStatisticsDto
            {
                Label = $"{month:D2}",

                CurrentPeriodRevenue = currentMonthData.Revenue,
                PreviousPeriodRevenue = previousMonthData.Revenue,
                RevenueChange = currentMonthData.Revenue - previousMonthData.Revenue,
                RevenueChangePercentage = previousMonthData.Revenue > 0
                    ? ((currentMonthData.Revenue - previousMonthData.Revenue) / previousMonthData.Revenue) * 100
                    : 0,

                CurrentPeriodProfit = currentMonthData.Profit,
                PreviousPeriodProfit = previousMonthData.Profit,
                ProfitChange = currentMonthData.Profit - previousMonthData.Profit,
                ProfitChangePercentage = previousMonthData.Profit > 0
                    ? ((currentMonthData.Profit - previousMonthData.Profit) / previousMonthData.Profit) * 100
                    : 0,

                CurrentPeriodOrders = currentMonthData.Orders,
                PreviousPeriodOrders = previousMonthData.Orders
            });
        }

        return result;
    }

    #endregion

    #region Helper Methods

    private static ProfitStatisticsDto ToProfitStatisticsDto(string label, DateTime date, decimal revenue, decimal cost)
    {
        var profit = revenue - cost;

        return new ProfitStatisticsDto
        {
            Label = label,
            Date = date,
            TotalRevenue = revenue,
            TotalCost = cost,
            TotalProfit = profit,
            ProfitMarginPercentage = revenue > 0 ? (profit / revenue) * 100 : 0
        };
    }

    private async Task<(decimal Revenue, decimal Cost, decimal Profit)> GetSalesSummaryAsync(DateTime startDate, DateTime endDate)
    {
        var data = await _context.OrderItems
            .AsNoTracking()
            .Where(oi =>
                oi.Order.Status == CompletedStatus &&
                oi.Order.CompletedAt.HasValue &&
                oi.Order.CompletedAt.Value >= startDate &&
                oi.Order.CompletedAt.Value < endDate)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.CostPrice * oi.Quantity)
            })
            .FirstOrDefaultAsync();

        var revenue = data?.Revenue ?? 0;
        var cost = data?.Cost ?? 0;

        return (revenue, cost, revenue - cost);
    }

    private async Task<(decimal Revenue, decimal Cost, decimal Profit, int Orders)> GetSalesSummaryWithOrdersAsync(DateTime startDate, DateTime endDate)
    {
        var data = await _context.OrderItems
            .AsNoTracking()
            .Where(oi =>
                oi.Order.Status == CompletedStatus &&
                oi.Order.CompletedAt.HasValue &&
                oi.Order.CompletedAt.Value >= startDate &&
                oi.Order.CompletedAt.Value < endDate)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Revenue = g.Sum(oi => oi.Price * oi.Quantity),
                Cost = g.Sum(oi => oi.CostPrice * oi.Quantity),
                Orders = g.Select(oi => oi.OrderId).Distinct().Count()
            })
            .FirstOrDefaultAsync();

        var revenue = data?.Revenue ?? 0;
        var cost = data?.Cost ?? 0;
        var orders = data?.Orders ?? 0;

        return (revenue, cost, revenue - cost, orders);
    }

    private static int GetWeekOfYear(DateTime date)
    {
        var culture = CultureInfo.CurrentCulture;
        return culture.Calendar.GetWeekOfYear(
            date,
            culture.DateTimeFormat.CalendarWeekRule,
            DayOfWeek.Monday
        );
    }

    #endregion
}