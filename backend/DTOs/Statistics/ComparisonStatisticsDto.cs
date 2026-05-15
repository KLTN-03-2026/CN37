namespace backend.DTOs.Statistics;

public class ComparisonStatisticsDto
{
    public string Label { get; set; }
    public decimal CurrentPeriodRevenue { get; set; }
    public decimal PreviousPeriodRevenue { get; set; }
    public decimal RevenueChange { get; set; }
    public decimal RevenueChangePercentage { get; set; }
    
    public decimal CurrentPeriodProfit { get; set; }
    public decimal PreviousPeriodProfit { get; set; }
    public decimal ProfitChange { get; set; }
    public decimal ProfitChangePercentage { get; set; }
    
    public int CurrentPeriodOrders { get; set; }
    public int PreviousPeriodOrders { get; set; }
}

public class ExportStatisticsRequestDto
{
    public string Format { get; set; } // EXCEL, PDF
    public string StatisticsType { get; set; } // REVENUE, PROFIT, IMPORT_COST, PRODUCT, SUMMARY
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string ReportTitle { get; set; }
}

public class CategoricalRevenueDto
{
    public long CategoryId { get; set; }
    public string CategoryName { get; set; }
    public decimal Revenue { get; set; }
    public decimal Profit { get; set; }
    public int ProductCount { get; set; }
    public int TotalQuantitySold { get; set; }
    public decimal PercentageOfTotal { get; set; }
}

public class DateRangeFilterDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class PaginatedStatisticsDto<T>
{
    public List<T> Items { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}
