# Analytics Module - Quick Reference Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Ready ✅
```bash
# Already configured in Program.cs
# Just start the backend:
cd backend
dotnet run

# API running at: http://localhost:5000
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install recharts
```

### Step 3: Add Dashboard Route
```jsx
// In your main routing file (e.g., App.jsx)
import { StatisticsDashboard } from './components/Dashboard/Statistics';

<Route path="/admin/statistics" element={<StatisticsDashboard />} />
```

### Step 4: Start Frontend
```bash
npm start
# Visit: http://localhost:3000/admin/statistics
```

---

## 📊 API Endpoints Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/dashboard` | GET | KPI summary & key metrics |
| `/revenue` | GET | Revenue by period |
| `/profit` | GET | Profit analysis |
| `/import-cost` | GET | Import costs |
| `/products` | GET | Product analytics (paginated) |
| `/products/{id}` | GET | Single product analytics |
| `/top-selling` | GET | Top 10 selling products |
| `/top-profit-products` | GET | Top 10 profit products |
| `/category-revenue` | GET | Revenue by category |
| `/comparison/month` | GET | This vs last month |
| `/comparison/year` | GET | This vs last year monthly |
| `/kpi-cards` | GET | 6 key metrics |
| `/export/excel` | POST | Export to Excel |
| `/export/pdf` | POST | Export to PDF |

---

## 🛠️ Most Common Tasks

### Get Dashboard Summary
```javascript
const response = await statisticsAPI.getDashboardSummary();
console.log(response.data.data.todayRevenue);
```

### Get Monthly Revenue
```javascript
const revenue = await statisticsAPI.getRevenueStatistics(
  'monthly',
  '2026-01-01',
  '2026-12-31'
);
```

### Get Top Products
```javascript
const topSelling = await statisticsAPI.getTopSellingProducts(10);
const topProfit = await statisticsAPI.getTopProfitProducts(10);
```

### Compare Periods
```javascript
const comparison = await statisticsAPI.compareCurrentVsPreviousMonth();
console.log(`Growth: ${comparison.data.revenueChangePercentage}%`);
```

---

## 📂 File Locations

| What | Where |
|------|-------|
| Controllers | `backend/Controllers/StatisticsController.cs` |
| Services | `backend/Services/StatisticsService.cs` |
| Repositories | `backend/Repositories/StatisticsRepository.cs` |
| DTOs | `backend/DTOs/Statistics/` |
| Dashboard | `frontend/src/components/Dashboard/Statistics/` |
| API Service | `frontend/src/services/statisticsAPI.js` |
| Database Index | `backend/Database/analytics-indexes.sql` |

---

## 🔑 Key Components

### React Components
- `StatisticsDashboard` - Main container
- `KPICard` - Metric display
- `RevenueChart` - Line chart
- `ProfitChart` - Bar chart
- `CategoryChart` - Pie chart
- `TopProductsTable` - Rankings table

### Backend Classes
- `StatisticsController` - 13 endpoints
- `StatisticsService` - Business logic
- `StatisticsRepository` - Data access (30+ methods)
- Multiple DTOs for type safety

---

## 📊 Data Periods

```
type: 'daily'      → Day by day
type: 'weekly'     → Week by week (ISO week)
type: 'monthly'    → Month by month
type: 'quarterly'  → Quarter by quarter
type: 'yearly'     → Year by year
```

---

## 💡 Example: Build a Custom Report

```javascript
import { StatisticsDashboard } from './components/Dashboard/Statistics';

// 1. Display dashboard
<StatisticsDashboard />

// 2. Custom query example
const fetchCustomReport = async () => {
  const revenue = await statisticsAPI.getRevenueStatistics(
    'monthly',
    '2026-01-01',
    '2026-12-31'
  );
  
  const profit = await statisticsAPI.getProfitStatistics(
    'monthly',
    '2026-01-01',
    '2026-12-31'
  );
  
  const topProducts = await statisticsAPI.getTopSellingProducts(20);
  
  // Use data...
};
```

---

## 🔐 Authentication

All endpoints require JWT token in header:

```javascript
// Automatically handled by axios interceptor or add manually:
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios.get('/api/statistics/dashboard', config);
```

---

## 📈 Common Calculations

### Growth Rate
```javascript
const growthRate = ((current - previous) / previous) * 100;
```

### Profit Margin
```javascript
const margin = (profit / revenue) * 100;
```

### Average Order Value
```javascript
const aov = totalRevenue / orderCount;
```

---

## 🎨 Styling

**Primary Color:** `#59c241` (green)  
**Typography:** Clean, modern sans-serif  
**Spacing:** 4px grid system  
**Responsive:** Mobile-first design  

Override in your variables.scss:
```scss
$primary-color: #59c241;
$text-primary: #1a1a1a;
$text-secondary: #6b7280;
```

---

## ⚡ Performance Tips

1. **Add Database Indexes**
   ```bash
   mysql kltn < backend/Database/analytics-indexes.sql
   ```

2. **Use Pagination**
   ```javascript
   // For products: pageNumber=1, pageSize=50
   ```

3. **Cache API Responses**
   ```javascript
   // Implement React Query for automatic caching
   ```

4. **Reduce Date Range**
   - Don't query 10 years of data
   - Use monthly aggregation for large ranges

---

## 🐛 Troubleshooting

### "No data returned"
- Check: orders.status = 'COMPLETED'
- Verify: completed_at is not NULL
- Confirm: Date range is correct

### "API returns 403"
- Verify: JWT token is valid
- Check: User has Admin role
- Ensure: Authorization header is set

### "Charts not displaying"
- Install: `npm install recharts`
- Check: API response format
- Verify: Data array is not empty

### "Slow performance"
- Run: Database index script
- Use: Shorter date ranges
- Enable: Pagination

---

## 📖 Documentation Files

- `ANALYTICS_MODULE_DOCUMENTATION.md` - Complete API reference
- `ANALYTICS_SETUP_GUIDE.md` - Detailed setup instructions
- `ANALYTICS_IMPLEMENTATION_SUMMARY.md` - What was built

---

## ✅ Verification Checklist

- [ ] Backend running (`dotnet run`)
- [ ] API responds at `/api/statistics/dashboard`
- [ ] Recharts installed (`npm install recharts`)
- [ ] Route added to `/admin/statistics`
- [ ] Frontend starts (`npm start`)
- [ ] Dashboard displays with KPI cards
- [ ] Charts load with data
- [ ] Tables show products

---

## 🔗 Integration Points

### Add to Navigation Menu
```jsx
<Link to="/admin/statistics">📊 Analytics</Link>
```

### Add as Admin Tab
```jsx
<AdminTabs>
  <Tab label="Statistics" component={StatisticsDashboard} />
</AdminTabs>
```

### Add Export Button
```jsx
<button onClick={handleExportExcel}>Download Report</button>
```

---

## 📞 Quick Help

**Issue:** Endpoints return 401  
**Fix:** Add JWT token to request headers

**Issue:** Charts are blank  
**Fix:** Check browser console for API errors

**Issue:** Dashboard page not found  
**Fix:** Add route to routing config

**Issue:** Data seems old  
**Fix:** Check completed_at timestamp in database

---

## 🎯 What This Module Provides

✅ 13 RESTful API endpoints  
✅ 30+ LINQ queries optimized  
✅ 6 React dashboard components  
✅ 3 interactive chart types  
✅ Complete KPI tracking  
✅ Period comparisons  
✅ Product rankings  
✅ Category analytics  
✅ Export framework (Excel/PDF ready)  
✅ Full documentation  

---

## 🚀 Ready to Deploy?

1. ✅ Backend: All services configured
2. ✅ Frontend: All components built
3. ✅ Database: Index script provided
4. ✅ Documentation: Complete guides included
5. ✅ Testing: API examples provided

**You're ready to go!**

---

**Last Updated:** May 9, 2026  
**Version:** 1.0 - Production Ready  
**Status:** ✅ Complete & Documented
