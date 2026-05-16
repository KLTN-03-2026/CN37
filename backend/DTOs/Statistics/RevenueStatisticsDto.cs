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


public class BusinessStatisticsDto
{
    public string Label { get; set; }
    public DateTime Date { get; set; }

    public decimal Revenue { get; set; }
    public decimal Cost { get; set; }
    public decimal Profit { get; set; }

    public int ExportCount { get; set; }

    public decimal ProfitMargin => Revenue > 0
        ? Math.Round((Profit / Revenue) * 100, 2)
        : 0;
}

public class StatisticsResponseDto<T>
{
    public List<T> Data { get; set; } = new();

    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal TotalProfit { get; set; }

    public decimal AverageRevenue { get; set; }
    public decimal AverageProfit { get; set; }

    public int Count { get; set; }
}
