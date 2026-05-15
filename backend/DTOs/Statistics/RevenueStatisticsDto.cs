namespace backend.DTOs.Statistics;

public class RevenueStatisticsDto
{
    public string Label { get; set; }
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public decimal Cost { get; set; }
    public decimal Profit { get; set; }
    public int OrderCount { get; set; }
    public decimal AverageOrderValue { get; set; }
}

public class ImportCostStatisticsDto
{
    public string Label { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalCost { get; set; }
    public int ImportCount { get; set; }
    public int TotalQuantity { get; set; }
}

public class ProfitStatisticsDto
{
    public string Label { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal ProfitMarginPercentage { get; set; }
}

public class RevenueFilterDto
{
    public string Type { get; set; } // daily, weekly, monthly, quarterly, yearly
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class StatisticsResponseDto<T>
{
    public List<T> Data { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public decimal AverageAmount { get; set; }
    public int Count { get; set; }
    public decimal GrowthPercentage { get; set; }
}
