using backend.DTOs.Statistics;

namespace backend.Repositories.Interfaces;

public interface IStatisticsRepository
{
    // Revenue Statistics
    Task<List<RevenueStatisticsDto>> GetRevenueByDayAsync(DateTime fromDate, DateTime toDate);
    Task<List<RevenueStatisticsDto>> GetRevenueByWeekAsync(DateTime fromDate, DateTime toDate);
    Task<List<RevenueStatisticsDto>> GetRevenueByMonthAsync(DateTime fromDate, DateTime toDate);
    Task<List<RevenueStatisticsDto>> GetRevenueByQuarterAsync(DateTime fromDate, DateTime toDate);
    Task<List<RevenueStatisticsDto>> GetRevenueByYearAsync(DateTime fromDate, DateTime toDate);
    
    // Import Cost Statistics
    Task<List<ImportCostStatisticsDto>> GetImportCostByDayAsync(DateTime fromDate, DateTime toDate);
    Task<List<ImportCostStatisticsDto>> GetImportCostByWeekAsync(DateTime fromDate, DateTime toDate);
    Task<List<ImportCostStatisticsDto>> GetImportCostByMonthAsync(DateTime fromDate, DateTime toDate);
    Task<List<ImportCostStatisticsDto>> GetImportCostByQuarterAsync(DateTime fromDate, DateTime toDate);
    Task<List<ImportCostStatisticsDto>> GetImportCostByYearAsync(DateTime fromDate, DateTime toDate);
    
    // Profit Statistics
    Task<List<ProfitStatisticsDto>> GetProfitByDayAsync(DateTime fromDate, DateTime toDate);
    Task<List<ProfitStatisticsDto>> GetProfitByWeekAsync(DateTime fromDate, DateTime toDate);
    Task<List<ProfitStatisticsDto>> GetProfitByMonthAsync(DateTime fromDate, DateTime toDate);
    Task<List<ProfitStatisticsDto>> GetProfitByQuarterAsync(DateTime fromDate, DateTime toDate);
    Task<List<ProfitStatisticsDto>> GetProfitByYearAsync(DateTime fromDate, DateTime toDate);
    
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
