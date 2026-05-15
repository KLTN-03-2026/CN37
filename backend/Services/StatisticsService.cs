using backend.DTOs.Statistics;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services;

public class StatisticsService : IStatisticsService
{
    private readonly IStatisticsRepository _statisticsRepository;

    public StatisticsService(IStatisticsRepository statisticsRepository)
    {
        _statisticsRepository = statisticsRepository;
    }

    public async Task<StatisticsResponseDto<RevenueStatisticsDto>> GetRevenueStatisticsAsync(
        string type, DateTime? fromDate = null, DateTime? toDate = null)
    {
        fromDate ??= DateTime.Now.AddMonths(-1);
        toDate ??= DateTime.Now;

        List<RevenueStatisticsDto> data = type.ToLower() switch
        {
            "daily" => await _statisticsRepository.GetRevenueByDayAsync(fromDate.Value, toDate.Value),
            "weekly" => await _statisticsRepository.GetRevenueByWeekAsync(fromDate.Value, toDate.Value),
            "monthly" => await _statisticsRepository.GetRevenueByMonthAsync(fromDate.Value, toDate.Value),
            "quarterly" => await _statisticsRepository.GetRevenueByQuarterAsync(fromDate.Value, toDate.Value),
            "yearly" => await _statisticsRepository.GetRevenueByYearAsync(fromDate.Value, toDate.Value),
            _ => await _statisticsRepository.GetRevenueByDayAsync(fromDate.Value, toDate.Value)
        };

        var totalRevenue = data.Sum(x => x.Revenue);
        var averageRevenue = data.Count > 0 ? data.Average(x => x.Revenue) : 0;
        var growthPercentage = CalculateGrowthPercentage(data, x => x.Revenue);

        return new StatisticsResponseDto<RevenueStatisticsDto>
        {
            Data = data,
            TotalAmount = totalRevenue,
            AverageAmount = averageRevenue,
            Count = data.Count,
            GrowthPercentage = growthPercentage
        };
    }

    public async Task<StatisticsResponseDto<ImportCostStatisticsDto>> GetImportCostStatisticsAsync(
        string type, DateTime? fromDate = null, DateTime? toDate = null)
    {
        fromDate ??= DateTime.Now.AddMonths(-1);
        toDate ??= DateTime.Now;

        List<ImportCostStatisticsDto> data = type.ToLower() switch
        {
            "daily" => await _statisticsRepository.GetImportCostByDayAsync(fromDate.Value, toDate.Value),
            "weekly" => await _statisticsRepository.GetImportCostByWeekAsync(fromDate.Value, toDate.Value),
            "monthly" => await _statisticsRepository.GetImportCostByMonthAsync(fromDate.Value, toDate.Value),
            "quarterly" => await _statisticsRepository.GetImportCostByQuarterAsync(fromDate.Value, toDate.Value),
            "yearly" => await _statisticsRepository.GetImportCostByYearAsync(fromDate.Value, toDate.Value),
            _ => await _statisticsRepository.GetImportCostByDayAsync(fromDate.Value, toDate.Value)
        };

        var totalCost = data.Sum(x => x.TotalCost);
        var averageCost = data.Count > 0 ? data.Average(x => x.TotalCost) : 0;
        var growthPercentage = CalculateGrowthPercentage(data, x => x.TotalCost);

        return new StatisticsResponseDto<ImportCostStatisticsDto>
        {
            Data = data,
            TotalAmount = totalCost,
            AverageAmount = averageCost,
            Count = data.Count,
            GrowthPercentage = growthPercentage
        };
    }

    public async Task<StatisticsResponseDto<ProfitStatisticsDto>> GetProfitStatisticsAsync(
        string type, DateTime? fromDate = null, DateTime? toDate = null)
    {
        fromDate ??= DateTime.Now.AddMonths(-1);
        toDate ??= DateTime.Now;

        List<ProfitStatisticsDto> data = type.ToLower() switch
        {
            "daily" => await _statisticsRepository.GetProfitByDayAsync(fromDate.Value, toDate.Value),
            "weekly" => await _statisticsRepository.GetProfitByWeekAsync(fromDate.Value, toDate.Value),
            "monthly" => await _statisticsRepository.GetProfitByMonthAsync(fromDate.Value, toDate.Value),
            "quarterly" => await _statisticsRepository.GetProfitByQuarterAsync(fromDate.Value, toDate.Value),
            "yearly" => await _statisticsRepository.GetProfitByYearAsync(fromDate.Value, toDate.Value),
            _ => await _statisticsRepository.GetProfitByDayAsync(fromDate.Value, toDate.Value)
        };

        var totalProfit = data.Sum(x => x.TotalProfit);
        var averageProfit = data.Count > 0 ? data.Average(x => x.TotalProfit) : 0;
        var growthPercentage = CalculateGrowthPercentage(data, x => x.TotalProfit);

        return new StatisticsResponseDto<ProfitStatisticsDto>
        {
            Data = data,
            TotalAmount = totalProfit,
            AverageAmount = averageProfit,
            Count = data.Count,
            GrowthPercentage = growthPercentage
        };
    }

    public async Task<PaginatedStatisticsDto<ProductAnalyticsDto>> GetProductAnalyticsAsync(
        int pageNumber = 1, int pageSize = 50)
    {
        var products = await _statisticsRepository.GetProductAnalyticsAsync(pageNumber, pageSize);

        var totalCount = products.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginatedStatisticsDto<ProductAnalyticsDto>
        {
            Items = products,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = pageNumber < totalPages,
            HasPreviousPage = pageNumber > 1
        };
    }

    public async Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId)
    {
        return await _statisticsRepository.GetProductAnalyticsByIdAsync(productId);
    }

    public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount = 10)
    {
        return await _statisticsRepository.GetTopSellingProductsAsync(topCount);
    }

    public async Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount = 10)
    {
        return await _statisticsRepository.GetTopProfitProductsAsync(topCount);
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        return await _statisticsRepository.GetDashboardSummaryAsync();
    }

    public async Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(
        DateTime? fromDate = null, DateTime? toDate = null)
    {
        return await _statisticsRepository.GetRevenueByCategoryAsync(fromDate, toDate);
    }

    public async Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync()
    {
        return await _statisticsRepository.CompareCurrentVsPreviousMonthAsync();
    }

    public async Task<List<ComparisonStatisticsDto>> CompareCurrentVsPreviousYearAsync()
    {
        return await _statisticsRepository.CompareCurrentVsPreviousYearAsync();
    }

    public async Task<List<KpiCardDto>> GetKpiCardsAsync()
    {
        var dashboard = await GetDashboardSummaryAsync();
        var comparisonMonth = await CompareCurrentVsPreviousMonthAsync();

        var kpiCards = new List<KpiCardDto>
        {
            new KpiCardDto
            {
                Title = "Today Revenue",
                Value = dashboard.TodayRevenue,
                Unit = "VND",
                PreviousPeriodValue = dashboard.TodayRevenuePreviousDay,
                ChangePercentage = dashboard.TodayRevenuePreviousDay > 0
                    ? ((dashboard.TodayRevenue - dashboard.TodayRevenuePreviousDay) / dashboard.TodayRevenuePreviousDay) * 100
                    : 0,
                Trend = dashboard.TodayRevenue >= dashboard.TodayRevenuePreviousDay ? "UP" : "DOWN",
                Color = "success"
            },
            new KpiCardDto
            {
                Title = "Today Profit",
                Value = dashboard.TodayProfit,
                Unit = "VND",
                PreviousPeriodValue = dashboard.TodayProfitPreviousDay,
                ChangePercentage = dashboard.TodayProfitPreviousDay > 0
                    ? ((dashboard.TodayProfit - dashboard.TodayProfitPreviousDay) / dashboard.TodayProfitPreviousDay) * 100
                    : 0,
                Trend = dashboard.TodayProfit >= dashboard.TodayProfitPreviousDay ? "UP" : "DOWN",
                Color = "info"
            },
            new KpiCardDto
            {
                Title = "Monthly Revenue Growth",
                Value = dashboard.RevenueGrowthPercentage,
                Unit = "%",
                PreviousPeriodValue = 0,
                ChangePercentage = dashboard.RevenueGrowthPercentage,
                Trend = dashboard.RevenueGrowthPercentage >= 0 ? "UP" : "DOWN",
                Color = dashboard.RevenueGrowthPercentage >= 0 ? "success" : "danger"
            },
            new KpiCardDto
            {
                Title = "Monthly Profit Growth",
                Value = dashboard.ProfitGrowthPercentage,
                Unit = "%",
                PreviousPeriodValue = 0,
                ChangePercentage = dashboard.ProfitGrowthPercentage,
                Trend = dashboard.ProfitGrowthPercentage >= 0 ? "UP" : "DOWN",
                Color = dashboard.ProfitGrowthPercentage >= 0 ? "success" : "danger"
            },
            new KpiCardDto
            {
                Title = "Completed Orders",
                Value = dashboard.CompletedOrders,
                Unit = "orders",
                PreviousPeriodValue = 0,
                ChangePercentage = 0,
                Trend = "STABLE",
                Color = "primary"
            },
            new KpiCardDto
            {
                Title = "Low Stock Products",
                Value = dashboard.TotalLowStockProducts,
                Unit = "products",
                PreviousPeriodValue = 0,
                ChangePercentage = 0,
                Trend = dashboard.TotalLowStockProducts > 0 ? "DOWN" : "UP",
                Color = dashboard.TotalLowStockProducts > 0 ? "warning" : "success"
            }
        };

        return kpiCards;
    }

    public async Task<byte[]> ExportStatisticsToExcelAsync(ExportStatisticsRequestDto request)
    {
        // This requires a library like EPPlus or ClosedXML
        // For now, returning empty bytes - implement actual Excel export
        throw new NotImplementedException("Excel export requires EPPlus or ClosedXML NuGet package");
    }

    public async Task<byte[]> ExportStatisticsToPdfAsync(ExportStatisticsRequestDto request)
    {
        // This requires a library like iText or SelectPdf
        // For now, returning empty bytes - implement actual PDF export
        throw new NotImplementedException("PDF export requires iTextSharp or SelectPdf NuGet package");
    }

    #region Helper Methods

    private decimal CalculateGrowthPercentage<T>(
    List<T> data,
    Func<T, decimal> selector)
    {
        if (data.Count < 2)
            return 0;

        var firstValue = selector(data.First());
        var lastValue = selector(data.Last());

        if (firstValue == 0)
            return lastValue > 0 ? 100 : 0;

        return ((lastValue - firstValue) / firstValue) * 100;
    }

    #endregion
}
