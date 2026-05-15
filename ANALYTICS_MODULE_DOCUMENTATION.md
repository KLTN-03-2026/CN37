# Analytics Module Documentation

## Overview

The Analytics Module is a comprehensive statistics and reporting system for the e-commerce platform. It provides insights into revenue, profit, product performance, and inventory management.

## Architecture

### Clean Architecture Pattern

```
Presentation Layer (Controllers)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories)
    ↓
Database (MySQL)
```

## Backend Components

### 1. DTOs (Data Transfer Objects)

Location: `backend/DTOs/Statistics/`

#### Core DTOs:
- **RevenueStatisticsDto**: Revenue metrics by period
- **ProfitStatisticsDto**: Profit analysis by period
- **ImportCostStatisticsDto**: Import costs by period
- **ProductAnalyticsDto**: Detailed product metrics
- **DashboardSummaryDto**: KPI aggregations
- **ComparisonStatisticsDto**: Period comparisons

### 2. Repository Layer

Location: `backend/Repositories/`

#### IStatisticsRepository Interface
```csharp
// Revenue Methods
Task<List<RevenueStatisticsDto>> GetRevenueByDayAsync(DateTime fromDate, DateTime toDate);
Task<List<RevenueStatisticsDto>> GetRevenueByWeekAsync(DateTime fromDate, DateTime toDate);
Task<List<RevenueStatisticsDto>> GetRevenueByMonthAsync(DateTime fromDate, DateTime toDate);
Task<List<RevenueStatisticsDto>> GetRevenueByQuarterAsync(DateTime fromDate, DateTime toDate);
Task<List<RevenueStatisticsDto>> GetRevenueByYearAsync(DateTime fromDate, DateTime toDate);

// Import Cost Methods
Task<List<ImportCostStatisticsDto>> GetImportCostByDayAsync(...);
Task<List<ImportCostStatisticsDto>> GetImportCostByWeekAsync(...);
Task<List<ImportCostStatisticsDto>> GetImportCostByMonthAsync(...);
Task<List<ImportCostStatisticsDto>> GetImportCostByQuarterAsync(...);
Task<List<ImportCostStatisticsDto>> GetImportCostByYearAsync(...);

// Profit Methods
Task<List<ProfitStatisticsDto>> GetProfitByDayAsync(...);
Task<List<ProfitStatisticsDto>> GetProfitByWeekAsync(...);
Task<List<ProfitStatisticsDto>> GetProfitByMonthAsync(...);
Task<List<ProfitStatisticsDto>> GetProfitByQuarterAsync(...);
Task<List<ProfitStatisticsDto>> GetProfitByYearAsync(...);

// Product Analytics
Task<List<ProductAnalyticsDto>> GetProductAnalyticsAsync(int pageNumber, int pageSize);
Task<ProductAnalyticsDto> GetProductAnalyticsByIdAsync(long productId);

// Top Products
Task<List<TopProductDto>> GetTopSellingProductsAsync(int topCount);
Task<List<TopProductDto>> GetTopProfitProductsAsync(int topCount);

// Dashboard
Task<DashboardSummaryDto> GetDashboardSummaryAsync();

// Category Analytics
Task<List<CategoricalRevenueDto>> GetRevenueByCategoryAsync(DateTime? fromDate, DateTime? toDate);

// Comparisons
Task<ComparisonStatisticsDto> CompareCurrentVsPreviousMonthAsync();
Task<List<ComparisonStatisticsDto>> CompareCurrentVsPreviousYearAsync();
```

### 3. Service Layer

Location: `backend/Services/StatisticsService.cs`

Key Responsibilities:
- Orchestrate repository calls
- Calculate growth percentages
- Format data for API responses
- Implement business logic

### 4. Controller

Location: `backend/Controllers/StatisticsController.cs`

## API Endpoints

### Base URL
```
http://localhost:5000/api/statistics
```

### Endpoints

#### 1. Dashboard Summary
```
GET /api/statistics/dashboard

Response:
{
  "success": true,
  "data": {
    "todayRevenue": 50000000,
    "todayProfit": 10000000,
    "todayRevenuePreviousDay": 45000000,
    "todayProfitPreviousDay": 9500000,
    "totalOrders": 1250,
    "completedOrders": 1100,
    "cancelledOrders": 50,
    "pendingOrders": 100,
    "monthlyRevenue": 1500000000,
    "monthlyProfit": 300000000,
    "monthlyRevenuePreviousMonth": 1400000000,
    "monthlyProfitPreviousMonth": 280000000,
    "topSellingProducts": [...],
    "topProfitProducts": [...],
    "lowStockProducts": [...],
    "totalLowStockProducts": 15,
    "revenueGrowthPercentage": 7.14,
    "profitGrowthPercentage": 7.14
  }
}
```

#### 2. Revenue Statistics
```
GET /api/statistics/revenue?type=monthly&fromDate=2026-01-01&toDate=2026-12-31

Parameters:
- type: daily|weekly|monthly|quarterly|yearly (default: daily)
- fromDate: ISO format date (default: 1 month ago)
- toDate: ISO format date (default: today)

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "label": "2026-01",
        "date": "2026-01-01T00:00:00",
        "revenue": 50000000,
        "cost": 30000000,
        "profit": 20000000,
        "orderCount": 150,
        "averageOrderValue": 333333.33
      }
    ],
    "totalAmount": 600000000,
    "averageAmount": 50000000,
    "count": 12,
    "growthPercentage": 15.5
  }
}
```

#### 3. Profit Statistics
```
GET /api/statistics/profit?type=monthly&fromDate=2026-01-01&toDate=2026-12-31

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "label": "2026-01",
        "date": "2026-01-01T00:00:00",
        "totalRevenue": 50000000,
        "totalCost": 30000000,
        "totalProfit": 20000000,
        "profitMarginPercentage": 40.0
      }
    ],
    "totalAmount": 240000000,
    "averageAmount": 20000000,
    "count": 12,
    "growthPercentage": 12.3
  }
}
```

#### 4. Import Cost Statistics
```
GET /api/statistics/import-cost?type=monthly&fromDate=2026-01-01&toDate=2026-12-31

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "label": "2026-01",
        "date": "2026-01-01T00:00:00",
        "totalCost": 30000000,
        "importCount": 8,
        "totalQuantity": 500
      }
    ],
    "totalAmount": 360000000,
    "averageAmount": 30000000,
    "count": 12,
    "growthPercentage": 8.5
  }
}
```

#### 5. Product Analytics
```
GET /api/statistics/products?pageNumber=1&pageSize=50

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": 1,
        "productName": "Product A",
        "category": "Electronics",
        "totalSoldQuantity": 450,
        "totalRevenue": 45000000,
        "totalCost": 22500000,
        "totalProfit": 22500000,
        "profitMarginPercentage": 50.0,
        "currentInventoryQuantity": 120,
        "averageSoldPrice": 100000,
        "averagePrice": 50000
      }
    ],
    "pageNumber": 1,
    "pageSize": 50,
    "totalCount": 234,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### 6. Top Selling Products
```
GET /api/statistics/top-selling?topCount=10

Response:
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "productName": "Best Seller 1",
      "category": "Electronics",
      "value": 150000000,
      "quantity": 1500
    }
  ]
}
```

#### 7. Top Profit Products
```
GET /api/statistics/top-profit-products?topCount=10

Response:
{
  "success": true,
  "data": [
    {
      "productId": 2,
      "productName": "High Margin Product",
      "category": "Premium",
      "value": 80000000,
      "quantity": 400
    }
  ]
}
```

#### 8. Category Revenue
```
GET /api/statistics/category-revenue?fromDate=2026-01-01&toDate=2026-12-31

Response:
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Electronics",
      "revenue": 300000000,
      "profit": 120000000,
      "productCount": 45,
      "totalQuantitySold": 2000,
      "percentageOfTotal": 35.5
    }
  ]
}
```

#### 9. Month Comparison
```
GET /api/statistics/comparison/month

Response:
{
  "success": true,
  "data": {
    "label": "2026-05",
    "currentPeriodRevenue": 150000000,
    "previousPeriodRevenue": 140000000,
    "revenueChange": 10000000,
    "revenueChangePercentage": 7.14,
    "currentPeriodProfit": 45000000,
    "previousPeriodProfit": 42000000,
    "profitChange": 3000000,
    "profitChangePercentage": 7.14,
    "currentPeriodOrders": 500,
    "previousPeriodOrders": 480
  }
}
```

#### 10. Year Comparison
```
GET /api/statistics/comparison/year

Response:
{
  "success": true,
  "data": [
    {
      "label": "01",
      "currentPeriodRevenue": 150000000,
      "previousPeriodRevenue": 140000000,
      "revenueChange": 10000000,
      "revenueChangePercentage": 7.14,
      "currentPeriodProfit": 45000000,
      "previousPeriodProfit": 42000000,
      "profitChange": 3000000,
      "profitChangePercentage": 7.14,
      "currentPeriodOrders": 500,
      "previousPeriodOrders": 480
    }
  ]
}
```

#### 11. KPI Cards
```
GET /api/statistics/kpi-cards

Response:
{
  "success": true,
  "data": [
    {
      "title": "Today Revenue",
      "value": 50000000,
      "unit": "VND",
      "previousPeriodValue": 45000000,
      "changePercentage": 11.11,
      "trend": "UP",
      "color": "success"
    }
  ]
}
```

#### 12. Export to Excel
```
POST /api/statistics/export/excel

Request Body:
{
  "format": "EXCEL",
  "statisticsType": "SUMMARY|REVENUE|PROFIT|PRODUCT",
  "fromDate": "2026-01-01",
  "toDate": "2026-12-31",
  "reportTitle": "Monthly Statistics Report"
}

Response: Binary file (.xlsx)
```

#### 13. Export to PDF
```
POST /api/statistics/export/pdf

Request Body:
{
  "format": "PDF",
  "statisticsType": "SUMMARY|REVENUE|PROFIT|PRODUCT",
  "fromDate": "2026-01-01",
  "toDate": "2026-12-31",
  "reportTitle": "Monthly Statistics Report"
}

Response: Binary file (.pdf)
```

## Business Logic

### Revenue Calculation
```
Revenue = order_items.price * order_items.quantity
```

### Cost Calculation
```
Cost = order_items.cost_price * order_items.quantity
```

### Profit Calculation
```
Profit = (order_items.price - order_items.cost_price) * order_items.quantity
```

### Profit Margin
```
ProfitMargin% = (Profit / Revenue) * 100
```

### Growth Percentage
```
GrowthPercentage = ((CurrentValue - PreviousValue) / PreviousValue) * 100
```

### Important: COMPLETED Orders Only
All calculations consider only orders where:
```sql
WHERE orders.status = 'COMPLETED'
```

## Frontend Components

Location: `frontend/src/components/Dashboard/Statistics/`

### Components

1. **StatisticsDashboard.jsx** - Main dashboard container
   - Renders all sub-components
   - Manages tab navigation
   - Handles export functions

2. **KPICard.jsx** - Key Performance Indicator card
   - Displays single metric with trend
   - Color-coded by category
   - Shows percentage change

3. **RevenueChart.jsx** - Line chart for revenue trends
   - Multiple time periods (daily/weekly/monthly/quarterly/yearly)
   - Revenue and profit lines
   - Interactive tooltips

4. **ProfitChart.jsx** - Bar chart for profit analysis
   - Profit and revenue comparison
   - Multiple time periods
   - Responsive design

5. **CategoryChart.jsx** - Pie chart for category distribution
   - Revenue by category
   - Percentage breakdown
   - Color-coded legend

6. **TopProductsTable.jsx** - Table of top products
   - Top selling or top profit variants
   - Ranking display
   - Quantity and value metrics

### Service Integration

Location: `frontend/src/services/statisticsAPI.js`

Provides API methods for all backend endpoints with error handling and response formatting.

## Installation & Setup

### Backend Setup

1. **Add NuGet Packages** (for future Excel/PDF export):
```bash
cd backend
dotnet add package EPPlus
dotnet add package iTextSharp
```

2. **Update Program.cs** (Already done):
```csharp
builder.Services.AddScoped<IStatisticsRepository, StatisticsRepository>();
builder.Services.AddScoped<IStatisticsService, StatisticsService>();
```

3. **Database Indexes** (Recommended for performance):
```sql
-- Add these indexes for faster queries
CREATE INDEX idx_order_status_completed ON orders(status, completed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_inventory_import_status ON inventory_imports(status, approved_at);
CREATE INDEX idx_inventory_import_items ON inventory_import_items(import_id);
```

### Frontend Setup

1. **Install Recharts** (for charts):
```bash
cd frontend
npm install recharts
```

2. **Add to Routes** (in your main routing file):
```jsx
import StatisticsDashboard from './components/Dashboard/Statistics/StatisticsDashboard';

// In your router
<Route path="/admin/statistics" element={<StatisticsDashboard />} />
```

3. **Add SCSS Variables** (if not exists):
```scss
// frontend/src/styles/variables.scss
$primary-color: #59c241;
$text-primary: #1a1a1a;
$text-secondary: #6b7280;
$border-color: #e5e7eb;
$background-light: #f9fafb;
$background-lighter: #f3f4f6;
```

## Performance Optimization

### LINQ Query Optimization
- Uses `AsNoTracking()` for read-only queries
- Implements efficient grouping and projections
- Avoids N+1 query problems

### Database Optimization
- Add recommended indexes
- Use computed columns for calculated fields
- Archive old data periodically

### Frontend Optimization
- Lazy load chart components
- Cache API responses with React Query
- Implement pagination for large datasets

## Business Rules

1. **Only COMPLETED orders are counted**
   - Status check: `orders.status = 'COMPLETED'`
   - Timestamp: Use `orders.completed_at`

2. **Use Snapshot Prices**
   - `order_items.price` (selling price at time of order)
   - `order_items.cost_price` (cost price at time of order)
   - DO NOT use current product prices

3. **Date Ranges**
   - Default: Last 30 days if not specified
   - ISO 8601 format for API calls

4. **Stock Thresholds**
   - Low stock threshold: 50 units (configurable)
   - Critical: Below 10 units
   - Warning: 10-50 units
   - Normal: Above 50 units

## Common Use Cases

### 1. Get Today's Revenue vs Yesterday
```javascript
const dashboard = await statisticsAPI.getDashboardSummary();
const change = dashboard.data.todayRevenue - dashboard.data.todayRevenuePreviousDay;
```

### 2. Compare Performance
```javascript
const comparison = await statisticsAPI.compareCurrentVsPreviousMonth();
console.log(`Monthly growth: ${comparison.data.revenueChangePercentage}%`);
```

### 3. Export Report
```javascript
await statisticsAPI.exportToExcel({
  format: "EXCEL",
  statisticsType: "SUMMARY",
  fromDate: "2026-01-01",
  toDate: "2026-12-31"
});
```

### 4. Get Top Products
```javascript
const topSelling = await statisticsAPI.getTopSellingProducts(10);
const topProfit = await statisticsAPI.getTopProfitProducts(10);
```

## Troubleshooting

### Issue: No data returned
- Check order status is "COMPLETED"
- Verify completed_at is not null
- Check date range parameters

### Issue: Slow queries
- Add recommended database indexes
- Reduce date range
- Use pagination

### Issue: Chart not displaying
- Ensure Recharts is installed
- Check API response format
- Verify data array is not empty

## Future Enhancements

1. **Real-time Analytics** - WebSocket updates
2. **Advanced Forecasting** - Predictive analytics
3. **Custom Reports** - User-defined reports
4. **Alerts & Notifications** - Business rule triggers
5. **Multi-currency Support** - Currency conversion
6. **Role-based Access** - Detailed permission management

## Support

For issues or questions, refer to:
- API documentation in this file
- Component source code comments
- Backend service implementations
