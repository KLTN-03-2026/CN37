using backend.DTOs.Statistics;

namespace backend.Services.Interfaces;

public interface IStatisticsService
{

     Task<StatisticsResponseDto<BusinessStatisticsDto>> GetBusinessStatisticsAsync(
        string type,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    // Revenue Statistics
    // Task<StatisticsResponseDto<RevenueStatisticsDto>> GetRevenueStatisticsAsync(
    //     string type, DateTime? fromDate = null, DateTime? toDate = null);
    
    // // Import Cost Statistics
    // Task<StatisticsResponseDto<ImportCostStatisticsDto>> GetImportCostStatisticsAsync(
    //     string type, DateTime? fromDate = null, DateTime? toDate = null);
    
    // // Profit Statistics
    // Task<StatisticsResponseDto<ProfitStatisticsDto>> GetProfitStatisticsAsync(
    //     string type, DateTime? fromDate = null, DateTime? toDate = null);
    
    // Product Analytics
    Task<PaginatedStatisticsDto<ProductAnalyticsDto>> GetProductAnalyticsAsync(
        int pageNumber = 1, int pageSize = 50);

    Task<List<BusinessAlertDto>> GetBusinessAlertsAsync();
    
    Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId);
    
    // Top Products
    Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount = 10);
    Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount = 10);
    
    // Dashboard
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    
    // Category Analytics
    Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(string type,DateTime? fromDate = null, DateTime? toDate = null);
    
    // Comparison
    Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync();
    Task<List<ComparisonStatisticsDto>> CompareCurrentVsPreviousYearAsync();
    
    // KPI Cards
    Task<List<KpiCardDto>> GetKpiCardsAsync();
    
    // Export
    Task<byte[]> ExportStatisticsToExcelAsync(ExportStatisticsRequestDto request);
    Task<byte[]> ExportStatisticsToPdfAsync(ExportStatisticsRequestDto request);
}
