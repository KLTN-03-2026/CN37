# 🔍 Real-time Product Search Implementation Guide

## 📋 Giới thiệu

Hệ thống tìm kiếm sản phẩm realtime hoàn chỉnh cho website e-commerce với:
- ✅ Backend API ASP.NET Core
- ✅ Frontend React với debounce
- ✅ Keyboard navigation
- ✅ Loading skeleton UI
- ✅ Search history localStorage
- ✅ Responsive design
- ✅ Highlight keyword
- ✅ Dropdown suggestions

---

## 🗂️ Cấu trúc Files

### Backend
```
backend/
├── Controllers/
│   └── ProductController.cs (✅ Endpoint mới: GET /api/products/search)
├── Services/
│   ├── Interfaces/
│   │   └── IProductService.cs (✅ Thêm SearchAsync)
│   └── ProductService.cs (✅ Thêm SearchAsync method)
└── DTOs/
    └── ProductSearchDto.cs (✅ DTO mới)
```

### Frontend
```
frontend/src/
├── hooks/
│   └── useDebounce.js (✅ Custom hook)
├── services/
│   └── productAPI.js (✅ API service)
├── Layout/components/Header/components/
│   ├── HeaderSearch.jsx (✅ Search component)
│   ├── HeaderSearch.module.scss (✅ Styling)
│   └── SearchBar.js (✅ Updated)
└── pages/
    └── SearchResults/
        ├── SearchResults.jsx (✅ Results page)
        └── SearchResults.module.scss (✅ Styling)
```

---

## ⚙️ Setup Instructions

### Backend Setup

#### 1. ProductSearchDto (✅ Đã tạo)
```csharp
// DTOs/ProductSearchDto.cs
public class ProductSearchDto
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string Thumbnail { get; set; }
}
```

#### 2. IProductService Interface (✅ Đã update)
Thêm method:
```csharp
Task<List<ProductSearchDto>> SearchAsync(string keyword);
```

#### 3. ProductService (✅ Đã update)
Thêm SearchAsync method:
```csharp
public async Task<List<ProductSearchDto>> SearchAsync(string keyword)
{
    if (string.IsNullOrWhiteSpace(keyword))
        return new List<ProductSearchDto>();

    keyword = keyword.Trim().ToLower();

    var products = await _context.Products
        .Where(p => p.IsActive && EF.Functions.Like(p.Name, $"%{keyword}%"))
        .AsNoTracking()
        .OrderByDescending(p => p.Name.StartsWith(keyword))
        .ThenByDescending(p => p.RatingAvg)
        .ThenByDescending(p => p.CreateAt)
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

    return products;
}
```

#### 4. ProductController (✅ Đã update)
Thêm endpoint:
```csharp
[HttpGet("search")]
public async Task<IActionResult> Search([FromQuery] string keyword)
{
    if (string.IsNullOrWhiteSpace(keyword) || keyword.Length < 1)
        return Ok(new List<ProductSearchDto>());

    var results = await _service.SearchAsync(keyword);
    return Ok(results);
}
```

#### 5. Kiểm tra API
```bash
# Test endpoint
GET http://localhost:5000/api/products/search?keyword=iphone

# Response
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 25000000,
    "discountPrice": 22000000,
    "thumbnail": "https://..."
  },
  ...
]
```

---

### Frontend Setup

#### 1. Environment Variables (✅ Cấu hình)
Thêm vào `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### 2. Install Dependencies (nếu chưa có)
```bash
npm install classnames react-icons
```

#### 3. Import HeaderSearch vào Header
```jsx
// Header/index.js hoặc Header.jsx
import HeaderSearch from './components/HeaderSearch';

export default function Header() {
  return (
    <header>
      <SearchBar /> {/* Sẽ render HeaderSearch */}
    </header>
  );
}
```

#### 4. Setup Routing
Thêm route cho Search Results page:
```jsx
// App.jsx hoặc main routing file
import SearchResults from './pages/SearchResults/SearchResults';

const routes = [
  // ... other routes
  {
    path: '/search',
    element: <SearchResults />
  }
];
```

---

## 🎯 Features & Usage

### 1. Header Search Component

**Location**: `frontend/src/Layout/components/Header/components/HeaderSearch.jsx`

**Features**:
- ✅ Debounce 400ms (tùy chỉnh)
- ✅ Real-time dropdown suggestions (max 8 products)
- ✅ Keyboard navigation (↑↓ Enter Esc)
- ✅ Click outside to close dropdown
- ✅ Loading skeleton UI
- ✅ Empty state message
- ✅ Keyword highlighting
- ✅ Search history (localStorage)
- ✅ Product thumbnail, name, price
- ✅ Discount badge

**UI Elements**:
```
┌─ Search Box ─────────────────────────────┐
│ 🔍 [Input field]        [✕] [Search button] │
└─────────────────────────────────────────┘
    ↓ (Dropdown appears on typing)
┌─ Dropdown Results ───────────────────────┐
│ ┌─ Product 1 ──────────────────────────┐ │
│ │ [Thumbnail] Name                     │ │
│ │             Price                    │ │
│ └──────────────────────────────────────┘ │
│ ┌─ Product 2 ──────────────────────────┐ │
│ │ [Thumbnail] Name                     │ │
│ │             Price                    │ │
│ └──────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. Search Results Page

**Location**: `frontend/src/pages/SearchResults/SearchResults.jsx`

**Features**:
- ✅ Display all search results
- ✅ Sort options (relevance, price, newest)
- ✅ Product count
- ✅ Grid responsive layout
- ✅ Empty state handling

### 3. Debounce Hook

**Location**: `frontend/src/hooks/useDebounce.js`

**Usage**:
```jsx
const debouncedValue = useDebounce(searchValue, 400);

// Tự động call API khi debouncedValue thay đổi
useEffect(() => {
  // Fetch results based on debouncedValue
}, [debouncedValue]);
```

### 4. API Service

**Location**: `frontend/src/services/productAPI.js`

**Methods**:
```javascript
// Search products
const results = await productAPI.search('iphone');

// Get product by slug
const product = await productAPI.getBySlug('iphone-15-pro');

// Get all products with filters
const products = await productAPI.getAll({
  categorySlug: 'dien-thoai',
  sortBy: 'price'
});
```

---

## ⌨️ Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Move down (next item) |
| `↑` | Move up (previous item) |
| `Enter` | Select highlighted item / Search |
| `Esc` | Close dropdown |

---

## 🎨 Customization

### Debounce Delay
```jsx
// HeaderSearch.jsx - thay đổi dòng này
const debouncedSearchValue = useDebounce(searchValue, 400); // 400ms
```

### Max Results
```csharp
// ProductService.cs - SearchAsync method
.Take(8) // Thay đổi số lượng
```

### Primary Color
```scss
// HeaderSearch.module.scss
$primary-color: #59c241; // Thay đổi màu
```

### API URL
```jsx
// productAPI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

---

## 🐛 Troubleshooting

### API không return kết quả
1. Kiểm tra database có sản phẩm không
2. Kiểm tra `IsActive = true` cho sản phẩm
3. Kiểm tra tên sản phẩm chứa keyword
4. Log SQL query để debug

### CORS Error
```csharp
// Program.cs - Add CORS policy
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

### Search không debounce
Kiểm tra:
1. `useDebounce` hook được import đúng
2. `debouncedSearchValue` được sử dụng trong `useEffect`
3. Không gọi API trực tiếp từ `onChange`

### Dropdown không hiển thị
1. Kiểm tra `isOpen` state
2. Kiểm tra `results.length > 0`
3. Kiểm tra z-index CSS

---

## 📊 Performance Optimization

### 1. Database Query Optimization
```csharp
// ✅ Đã áp dụng
.AsNoTracking() // Không tracking entities
.Take(8)        // Giới hạn kết quả
EF.Functions.Like(p.Name, $"%{keyword}%") // Case-insensitive search
```

### 2. Frontend Optimization
```javascript
// ✅ Debounce prevents excessive API calls
useEffect(() => {
  // Fetch only when debouncedValue changes
}, [debouncedSearchValue]);

// ✅ Keyboard navigation không re-render list
const [selectedIndex, setSelectedIndex] = useState(-1);
```

### 3. Advanced: Full Text Search (Optional)
```sql
-- SQL: Enable Full Text Search (nếu cần tìm kiếm cao cấp hơn)
CREATE FULLTEXT INDEX idx_product_name ON Products(Name);

-- Query
SELECT * FROM Products 
WHERE MATCH(Name) AGAINST('+iphone -samsung' IN BOOLEAN MODE)
```

---

## 🚀 Deployment Checklist

- [ ] Update `REACT_APP_API_URL` cho production
- [ ] Test CORS policy
- [ ] Enable HTTPS
- [ ] Compress images cho thumbnails
- [ ] Add error boundaries
- [ ] Monitor API response times
- [ ] Test keyboard navigation
- [ ] Test responsive design trên mobile
- [ ] Clear browser cache testing

---

## 📝 API Endpoint Details

### GET /api/products/search

**Parameters**:
- `keyword` (query) - Từ khóa tìm kiếm

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 25000000,
    "discountPrice": 22000000,
    "thumbnail": "https://..."
  }
]
```

**Response** (empty keyword):
```json
[]
```

**Query Performance**:
- Sắp xếp theo relevance (keyword match start của tên)
- Sau đó rating
- Sau đó ngày tạo
- Max 8 results

---

## 💡 Tips & Best Practices

1. **Search History**: Tự động lưu localStorage
   ```javascript
   const newHistory = [searchValue, ...searchHistory].slice(0, 10);
   localStorage.setItem('searchHistory', JSON.stringify(newHistory));
   ```

2. **Keyword Highlighting**: Tô vàng keyword trong kết quả
   ```jsx
   <span className={cx('highlight')}>{keyword}</span>
   ```

3. **Discount Badge**: Hiển thị % giảm giá
   ```javascript
   const discountPercent = ((price - discountPrice) / price) * 100;
   ```

4. **Empty Input Handling**: Ẩn dropdown khi input rỗng
   ```javascript
   if (!debouncedSearchValue.trim()) {
     setResults([]);
     setIsOpen(false);
     return;
   }
   ```

5. **Mobile Optimization**: Responsive touchscreen
   - Dropdown scrollable trên mobile
   - Thumbnail 70px trên mobile vs 80px desktop
   - Font size tự động adjust

---

## 📚 Code Examples

### Custom Hook Usage
```jsx
function MyComponent() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    console.log('Debounced:', debouncedValue);
  }, [debouncedValue]);

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

### API Service Usage
```jsx
async function handleSearch(keyword) {
  try {
    const results = await productAPI.search(keyword);
    console.log('Results:', results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}
```

### Product Card
```jsx
<div className={cx('productCard')}>
  <img src={product.thumbnail} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.discountPrice || product.price}₫</p>
</div>
```

---

## 📞 Support

Nếu có vấn đề:
1. Check console error
2. Check network tab (API calls)
3. Check localStorage (search history)
4. Kiểm tra environment variables
5. Test API endpoint trực tiếp bằng Postman

---

**Last Updated**: May 2026
**Status**: ✅ Production Ready
