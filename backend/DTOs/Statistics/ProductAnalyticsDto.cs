namespace backend.DTOs.Statistics;

public class ProductAnalyticsDto
{
    public long ProductId { get; set; }
    public string ProductName { get; set; }
    public string Category { get; set; }
    public int TotalSoldQuantity { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal ProfitMarginPercentage { get; set; }
    public int CurrentInventoryQuantity { get; set; }
    public decimal AverageSoldPrice { get; set; }
    public decimal AveragePrice { get; set; }
}

public class TopProductDto
{
    public long ProductId { get; set; }
    public string ProductName { get; set; }
    public string Category { get; set; }
    public decimal Value { get; set; } // Revenue or Profit
    public int Quantity { get; set; }
}

public class LowStockProductDto
{
    public long ProductId { get; set; }
    public string ProductName { get; set; }
    public string Category { get; set; }
    public int CurrentQuantity { get; set; }
    public int MinimumStockLevel { get; set; }
    public string Status { get; set; } // CRITICAL, WARNING, LOW
}

public class DashboardSummaryDto
{
    public decimal TodayRevenue { get; set; }
    public decimal TodayProfit { get; set; }
    public decimal TodayRevenuePreviousDay { get; set; }
    public decimal TodayProfitPreviousDay { get; set; }
    
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public int PendingOrders { get; set; }
    
    public decimal MonthlyRevenue { get; set; }
    public decimal MonthlyProfit { get; set; }
    public decimal MonthlyRevenuePreviousMonth { get; set; }
    public decimal MonthlyProfitPreviousMonth { get; set; }
    
    public List<TopProductDto> TopSellingProducts { get; set; } = new();
    public List<TopProductDto> TopProfitProducts { get; set; } = new();
    public List<LowStockProductDto> LowStockProducts { get; set; } = new();
    
    public int TotalLowStockProducts { get; set; }
    public decimal RevenueGrowthPercentage { get; set; }
    public decimal ProfitGrowthPercentage { get; set; }
}

public class KpiCardDto
{
    public string Title { get; set; }
    public decimal Value { get; set; }
    public string Unit { get; set; } // VND, %, unit, etc.
    public decimal PreviousPeriodValue { get; set; }
    public decimal ChangePercentage { get; set; }
    public string Trend { get; set; } // UP, DOWN, STABLE
    public string Color { get; set; } // success, warning, danger, info
}
