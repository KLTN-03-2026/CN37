using backend.DTOs.Statistics;

namespace backend.Repositories.Interfaces;

public interface IStatisticsRepository
{
    Task<List<BusinessStatisticsDto>> GetStatisticsByDayAsync(DateTime fromDate, DateTime toDate);

    Task<List<BusinessStatisticsDto>> GetStatisticsByMonthAsync(DateTime fromDate, DateTime toDate);

    Task<List<BusinessStatisticsDto>> GetStatisticsByQuarterAsync(DateTime fromDate, DateTime toDate);

    Task<List<BusinessStatisticsDto>> GetStatisticsByYearAsync(DateTime fromDate, DateTime toDate);

    
    // Product Analytics
    Task<List<ProductAnalyticsDto>> GetProductAnalyticsAsync(int pageNumber = 1, int pageSize = 50);
    Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId);
    Task<List<ProductAnalyticsDto>> GetLowStockProductsAsync(int threshold = 50);
    
    // Top Products
    Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount = 10);
    Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount = 10);
    
    // Dashboard Summary
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    
    // Category Analytics
    Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(DateTime? fromDate = null, DateTime? toDate = null);
    
    // Comparison
    Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync();
    Task<List<ComparisonStatisticsDto>> CompareCurrentVsPreviousYearAsync();
}
