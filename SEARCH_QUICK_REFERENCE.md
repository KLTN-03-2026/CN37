# 🔍 Search Feature - Developer Quick Reference

## 🎯 Feature Overview

```
┌─────────────────────────────────────────────┐
│           HEADER SEARCH FLOW                │
└─────────────────────────────────────────────┘

1. User Types in Input
        ↓
2. onChange triggers (setState)
        ↓
3. Debounce waits 400ms
        ↓
4. useEffect detects debouncedValue change
        ↓
5. Call API: GET /api/products/search?keyword=...
        ↓
6. Display Results in Dropdown (max 8 items)
        ↓
7. User Click/Enter → Navigate to product or results page
        ↓
8. Save to Search History (localStorage)
```

---

## 📝 Code Snippets Reference

### 1. Debounce Hook
```javascript
// frontend/src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### 2. API Service
```javascript
// frontend/src/services/productAPI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const productAPI = {
  search: async (keyword) => {
    if (!keyword?.trim()) return [];
    
    const response = await fetch(
      `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`
    );
    
    return response.ok ? await response.json() : [];
  }
};
```

### 3. Component State Management
```javascript
// In HeaderSearch.jsx
const [searchValue, setSearchValue] = useState('');              // Current input
const [isOpen, setIsOpen] = useState(false);                    // Dropdown visible?
const [results, setResults] = useState([]);                      // Search results
const [loading, setLoading] = useState(false);                  // Loading state
const [selectedIndex, setSelectedIndex] = useState(-1);         // Keyboard nav
const [searchHistory, setSearchHistory] = useState([]);         // History
```

### 4. Fetch Results
```javascript
// Debounce search value
const debouncedSearchValue = useDebounce(searchValue, 400);

// Effect to fetch when debounced value changes
useEffect(() => {
  if (!debouncedSearchValue.trim()) {
    setResults([]);
    setIsOpen(false);
    return;
  }

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(debouncedSearchValue)}`
      ).then(r => r.json());
      
      setResults(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [debouncedSearchValue]);
```

### 5. Keyboard Navigation
```javascript
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : 0
      );
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : results.length - 1
      );
      break;
      
    case 'Enter':
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectProduct(results[selectedIndex]);
      } else if (searchValue.trim()) {
        navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      setIsOpen(false);
      break;
  }
};
```

### 6. Backend Search Method
```csharp
// ProductService.cs
public async Task<List<ProductSearchDto>> SearchAsync(string keyword)
{
    if (string.IsNullOrWhiteSpace(keyword))
        return new List<ProductSearchDto>();

    keyword = keyword.Trim().ToLower();

    return await _context.Products
        .Where(p => p.IsActive && EF.Functions.Like(p.Name, $"%{keyword}%"))
        .AsNoTracking()
        .OrderByDescending(p => p.Name.StartsWith(keyword))  // Priority 1: Name starts with
        .ThenByDescending(p => p.RatingAvg)                   // Priority 2: Rating
        .ThenByDescending(p => p.CreateAt)                    // Priority 3: Newest
        .Take(8)
        .Select(p => new ProductSearchDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            Thumbnail = p.Thumbnail
        })
        .ToListAsync();
}
```

---

## 🐛 Debugging Guide

### Issue: Search not working
```javascript
// Debug Steps:
1. Open DevTools Console
2. Type in search box
3. Check if:
   - onChange event fires: console.log('onChange', value)
   - Debounce working: Wait 400ms after typing
   - Network tab shows API call
   - API response contains data
   - Dropdown state updates: setResults(data)
```

### Issue: API returns 404
```bash
# Check backend
1. Is ProductController.cs modified?
2. Is search endpoint added?
3. Is service method implemented?
4. Run: dotnet run
5. Test: curl "http://localhost:5000/api/products/search?keyword=test"
```

### Issue: Search returns empty
```csharp
// Debug in ProductService
public async Task<List<ProductSearchDto>> SearchAsync(string keyword)
{
    // Add logging
    Console.WriteLine($"Searching for: {keyword}");
    
    var query = _context.Products
        .Where(p => p.IsActive && EF.Functions.Like(p.Name, $"%{keyword}%"));
    
    var count = await query.CountAsync();
    Console.WriteLine($"Found {count} products");
    
    return await query... // continue
}
```

### Issue: Dropdown not showing
```javascript
// Check conditions:
const isVisible = debouncedSearchValue.trim() && results.length > 0 && isOpen;
console.log('Dropdown visible:', isVisible);
console.log('Search value:', debouncedSearchValue);
console.log('Results:', results);
console.log('isOpen:', isOpen);
```

### Issue: Keyboard navigation not working
```javascript
// Debug keyDown:
const handleKeyDown = (e) => {
  console.log('Key pressed:', e.key);
  console.log('Results available:', results.length);
  console.log('Selected index:', selectedIndex);
  
  // Then handle logic
};
```

### Issue: Images not loading
```javascript
// Add error handler:
<img 
  src={product.thumbnail}
  alt={product.name}
  onError={(e) => {
    console.error('Image load error:', product.thumbnail);
    e.target.src = '/default-product.png';
  }}
/>
```

---

## 🔍 Performance Checks

### Frontend
```javascript
// Measure debounce effectiveness
let apiCallCount = 0;

const fetchResults = async () => {
  apiCallCount++;
  console.log(`API call #${apiCallCount}`);
  // Without debounce: ~100+ calls
  // With debounce: ~5-10 calls
};
```

### Backend
```csharp
// Check query performance
using (var context = new AppDbContext())
{
    var sw = System.Diagnostics.Stopwatch.StartNew();
    
    var results = await _service.SearchAsync("iphone");
    
    sw.Stop();
    Console.WriteLine($"Search took {sw.ElapsedMilliseconds}ms");
}
// Should be < 100ms
```

---

## 📊 State Flow Diagram

```
User Input
    ↓
onChange → setState(searchValue)
    ↓
useDebounce Hook
    ↓ (waits 400ms)
debouncedSearchValue changes
    ↓
useEffect triggered
    ↓
setLoading(true)
    ↓
API Call
    ↓
Response
    ↓
setResults(data)
setLoading(false)
setIsOpen(true)
    ↓
Component Re-render
    ↓
Dropdown Visible with Results
```

---

## 🎯 Testing Examples

### Unit Test: useDebounce Hook
```javascript
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

test('debounce delays value update', async () => {
  const { result, rerender } = renderHook(
    ({ value, delay }) => useDebounce(value, delay),
    { initialProps: { value: 'a', delay: 300 } }
  );

  expect(result.current).toBe('a');

  // Change value
  rerender({ value: 'ab', delay: 300 });
  expect(result.current).toBe('a'); // Still old value

  // Wait for debounce
  await new Promise(r => setTimeout(r, 350));
  expect(result.current).toBe('ab'); // Updated
});
```

### Integration Test: Search Flow
```javascript
test('search flow', async () => {
  render(<HeaderSearch />);
  
  // Type in input
  const input = screen.getByPlaceholderText(/tìm kiếm/i);
  fireEvent.change(input, { target: { value: 'iphone' } });
  
  // Wait for debounce and API
  await waitFor(() => {
    expect(screen.getByText(/iPhone/i)).toBeInTheDocument();
  }, { timeout: 500 });
});
```

---

## 🔧 Configuration Checklist

- [ ] Backend: IProductService has SearchAsync method
- [ ] Backend: ProductService implements SearchAsync
- [ ] Backend: ProductController has search endpoint
- [ ] Backend: ProductSearchDto created
- [ ] Frontend: useDebounce.js created
- [ ] Frontend: HeaderSearch.jsx created
- [ ] Frontend: HeaderSearch.module.scss created
- [ ] Frontend: productAPI.js created
- [ ] Frontend: SearchResults.jsx created
- [ ] Frontend: .env has REACT_APP_API_URL
- [ ] Frontend: SearchResults route added to App.jsx
- [ ] Frontend: SearchBar.js updated to use HeaderSearch
- [ ] Database: Products table has IsActive, Name, Slug, Thumbnail
- [ ] Database: Products indexed (optional but recommended)

---

## 🚀 Deployment Steps

### Backend
```bash
# 1. Build release
dotnet publish -c Release

# 2. Deploy to server
# Copy release folder to server

# 3. Update connection string in appsettings.Production.json

# 4. Run migrations
dotnet ef database update

# 5. Start service
dotnet ProductAPI.dll
```

### Frontend
```bash
# 1. Build production
npm run build

# 2. Update environment
REACT_APP_API_URL=https://api.example.com

# 3. Deploy to static host
# Copy build/ folder to CDN/Server

# 4. Test endpoints
curl "https://api.example.com/api/products/search?keyword=test"
```

---

## 💡 Optimization Tips

### Database
```sql
-- Add index for faster search
CREATE INDEX idx_product_name ON Products(Name);
CREATE INDEX idx_product_active ON Products(IsActive);
```

### Frontend
```javascript
// Use React.memo for product items
const ProductItem = React.memo(({ product }) => (
  // render
));

// Use useCallback for event handlers
const handleSelectProduct = useCallback((product) => {
  // handle
}, []);
```

### Backend
```csharp
// Add caching layer (optional)
var cacheKey = $"search_{keyword}";
if (_cache.TryGetValue(cacheKey, out var cached))
    return cached;

var results = await _context.Products...
_cache.Set(cacheKey, results, TimeSpan.FromMinutes(5));
return results;
```

---

## 📞 Common Questions

**Q: How to change debounce delay?**
A: In HeaderSearch.jsx, line: `const debouncedSearchValue = useDebounce(searchValue, 400);`
Change 400 to desired milliseconds.

**Q: How to limit results differently?**
A: In ProductService.cs SearchAsync, change: `.Take(8)` to `.Take(X)`

**Q: How to add more fields to search results?**
A: 
1. Add field to ProductSearchDto
2. Add field to Select in SearchAsync

**Q: How to support multiple languages?**
A: Implement i18n in component strings

**Q: How to add more search endpoints?**
A: 
1. Add method to IProductService
2. Implement in ProductService
3. Add endpoint to Controller

---

## 📚 File Dependencies

```
HeaderSearch.jsx
├── useDebounce (hook)
├── productAPI (service)
├── react-router-dom (navigation)
├── react-icons (icons)
├── HeaderSearch.module.scss (styles)
└── classnames (cx binding)

ProductService.cs
├── AppDbContext
├── Product Entity
└── ProductSearchDto

ProductAPI.js (no dependencies)

SearchResults.jsx
├── productAPI
├── react-router-dom
├── SearchResults.module.scss
└── classnames
```

---

## ✅ Pre-Launch Checklist

- [ ] All API endpoints tested
- [ ] All frontend components render
- [ ] Search debounce working (wait 400ms)
- [ ] Keyboard navigation tested
- [ ] Mobile responsive tested
- [ ] Images load correctly
- [ ] Error handling tested
- [ ] Empty state showing
- [ ] Loading state showing
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Database populated with test data
- [ ] Performance acceptable (< 100ms API response)
- [ ] All console errors resolved
- [ ] All network errors handled
- [ ] Browser compatibility tested

---

**Remember**: Always test in dev before deploying to production! 🚀
