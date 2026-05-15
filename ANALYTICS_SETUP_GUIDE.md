# Analytics Module Implementation Guide

## Quick Start

### Step 1: Backend Setup (Completed)

✅ **DTOs Created**
- `backend/DTOs/Statistics/RevenueStatisticsDto.cs`
- `backend/DTOs/Statistics/ProductAnalyticsDto.cs`
- `backend/DTOs/Statistics/ComparisonStatisticsDto.cs`

✅ **Repository Implemented**
- `backend/Repositories/StatisticsRepository.cs`
- `backend/Repositories/Interfaces/IStatisticsRepository.cs`

✅ **Services Implemented**
- `backend/Services/StatisticsService.cs`
- `backend/Services/Interfaces/IStatisticsService.cs`

✅ **Controller Created**
- `backend/Controllers/StatisticsController.cs`

✅ **Dependency Injection Updated**
- `backend/Program.cs` - Services registered

### Step 2: Database Optimization (Optional but Recommended)

Run the index creation script:
```bash
mysql -u root -p kltn < backend/Database/analytics-indexes.sql
```

Or execute in MySQL Workbench:
```sql
source backend/Database/analytics-indexes.sql;
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install recharts
```

#### 3.2 Verify Files Created
- `frontend/src/services/statisticsAPI.js`
- `frontend/src/components/Dashboard/Statistics/StatisticsDashboard.jsx`
- `frontend/src/components/Dashboard/Statistics/KPICard.jsx`
- `frontend/src/components/Dashboard/Statistics/RevenueChart.jsx`
- `frontend/src/components/Dashboard/Statistics/ProfitChart.jsx`
- `frontend/src/components/Dashboard/Statistics/CategoryChart.jsx`
- `frontend/src/components/Dashboard/Statistics/TopProductsTable.jsx`

#### 3.3 Add Routing

In your main routing file (e.g., `App.jsx` or `Routes.jsx`):

```jsx
import StatisticsDashboard from './components/Dashboard/Statistics/StatisticsDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ... other routes ... */}
      
      {/* Admin Statistics Route */}
      <Route 
        path="/admin/statistics" 
        element={<ProtectedRoute><StatisticsDashboard /></ProtectedRoute>} 
      />
    </Routes>
  );
}
```

### Step 4: Verify Installation

#### 4.1 Test Backend API

Start the backend:
```bash
cd backend
dotnet run
```

Test endpoint:
```bash
curl -X GET "http://localhost:5000/api/statistics/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.2 Test Frontend

Start the frontend:
```bash
cd frontend
npm start
```

Navigate to: `http://localhost:3000/admin/statistics`

## File Structure

```
project-root/
├── backend/
│   ├── Controllers/
│   │   └── StatisticsController.cs
│   ├── DTOs/
│   │   └── Statistics/
│   │       ├── RevenueStatisticsDto.cs
│   │       ├── ProductAnalyticsDto.cs
│   │       └── ComparisonStatisticsDto.cs
│   ├── Repositories/
│   │   ├── StatisticsRepository.cs
│   │   └── Interfaces/
│   │       └── IStatisticsRepository.cs
│   ├── Services/
│   │   ├── StatisticsService.cs
│   │   └── Interfaces/
│   │       └── IStatisticsService.cs
│   ├── Database/
│   │   └── analytics-indexes.sql
│   └── Program.cs
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── statisticsAPI.js
    │   ├── components/
    │   │   └── Dashboard/
    │   │       └── Statistics/
    │   │           ├── StatisticsDashboard.jsx
    │   │           ├── StatisticsDashboard.module.scss
    │   │           ├── KPICard.jsx
    │   │           ├── KPICard.module.scss
    │   │           ├── RevenueChart.jsx
    │   │           ├── RevenueChart.module.scss
    │   │           ├── ProfitChart.jsx
    │   │           ├── ProfitChart.module.scss
    │   │           ├── CategoryChart.jsx
    │   │           ├── CategoryChart.module.scss
    │   │           ├── TopProductsTable.jsx
    │   │           └── TopProductsTable.module.scss
    │   └── styles/
    │       └── variables.scss
```

## API Authentication

All endpoints require JWT authentication:

```javascript
// Add Authorization header
const config = {
  headers: {
    'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
  }
};

axios.get('/api/statistics/dashboard', config);
```

## Testing Examples

### 1. Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/statistics/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Get Monthly Revenue
```bash
curl -X GET "http://localhost:5000/api/statistics/revenue?type=monthly&fromDate=2026-01-01&toDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Get Top Products
```bash
curl -X GET "http://localhost:5000/api/statistics/top-selling?topCount=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Get Product Analytics
```bash
curl -X GET "http://localhost:5000/api/statistics/products?pageNumber=1&pageSize=50" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Analytics API",
    "description": "E-commerce Analytics Endpoints",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Dashboard Summary",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/dashboard",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Revenue Statistics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/revenue?type=monthly&fromDate=2026-01-01&toDate=2026-12-31",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Profit Statistics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/profit?type=monthly",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Import Cost Statistics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/import-cost?type=monthly",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Product Analytics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/products?pageNumber=1&pageSize=50",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Top Selling Products",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/top-selling?topCount=10",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Top Profit Products",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/top-profit-products?topCount=10",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Category Revenue",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/category-revenue",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Comparison Month",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/comparison/month",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Comparison Year",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/comparison/year",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "KPI Cards",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/statistics/kpi-cards",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    }
  ]
}
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000
```

### Backend (appsettings.Development.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;user=root;password=your_password;database=kltn;"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key_here_min_32_chars",
    "Issuer": "your_issuer",
    "Audience": "your_audience"
  }
}
```

## Performance Tips

### 1. Database Level
- Execute the index creation script
- Use ANALYZE TABLE regularly
- Archive old data (orders > 2 years)
- Implement data partitioning for large tables

### 2. API Level
- Use pagination for large datasets
- Implement caching with Redis
- Add API response compression
- Consider pagination for product analytics

### 3. Frontend Level
- Lazy load charts
- Use React Query for caching
- Implement virtual scrolling for large tables
- Debounce date range filters

### 4. Query Optimization
```csharp
// Use projections instead of full entity loads
var results = dbContext.Orders
    .AsNoTracking()
    .Where(o => o.Status == "COMPLETED")
    .Select(o => new { o.Id, o.Amount, o.CompletedAt })
    .ToListAsync();

// Use grouping at database level
var grouped = dbContext.Orders
    .AsNoTracking()
    .GroupBy(o => o.CompletedAt.Date)
    .Select(g => new { Date = g.Key, Total = g.Sum(o => o.Amount) })
    .ToListAsync();
```

## Common Issues & Solutions

### Issue 1: "No data returned"
**Solution:**
- Verify orders have status = 'COMPLETED'
- Check completed_at is not NULL
- Verify date range is correct

### Issue 2: "API returns 403 Forbidden"
**Solution:**
- Check JWT token is valid
- Verify user has Admin role
- Add proper Authorization header

### Issue 3: "Slow API responses"
**Solution:**
- Run index creation script
- Reduce date range
- Use pagination
- Check database connection

### Issue 4: "Charts not rendering"
**Solution:**
- Verify Recharts is installed
- Check API response format
- Ensure data array is not empty
- Check browser console for errors

## Next Steps

### To Implement Export Features (Optional):

1. Install NuGet packages:
```bash
dotnet add package EPPlus  # For Excel
dotnet add package iTextSharp  # For PDF
```

2. Implement methods in StatisticsService:
```csharp
public async Task<byte[]> ExportStatisticsToExcelAsync(ExportStatisticsRequestDto request)
{
    // Implementation with EPPlus
}

public async Task<byte[]> ExportStatisticsToPdfAsync(ExportStatisticsRequestDto request)
{
    // Implementation with iTextSharp
}
```

### To Implement Real-time Updates (Optional):

Use SignalR for WebSocket connections to push updates to connected clients in real-time.

## Support & Troubleshooting

For detailed API documentation, see: `ANALYTICS_MODULE_DOCUMENTATION.md`

## Deployment Checklist

- [ ] Add database indexes
- [ ] Test all API endpoints
- [ ] Configure CORS if needed
- [ ] Set up authentication tokens
- [ ] Configure environment variables
- [ ] Test frontend components
- [ ] Performance test with large datasets
- [ ] Set up monitoring/logging
- [ ] Create backup strategy for analytics data
