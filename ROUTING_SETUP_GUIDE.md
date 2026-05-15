# 🛣️ Routing Setup Guide for Search Feature

## Overview

The search feature includes two main routes:
1. **Header Search** - Embedded in Header (auto-complete dropdown)
2. **Search Results Page** - Full page with all results `/search?keyword=...`

---

## Setup Instructions

### Step 1: Add Route to Your Routing Configuration

#### Option A: If using `App.jsx` with React Router v6

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchResults from './pages/SearchResults/SearchResults';

// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... other routes ... */}
        
        {/* ADD THIS ROUTE */}
        <Route path="/search" element={<SearchResults />} />
        
        {/* Product detail route (should already exist) */}
        <Route path="/product/:slug" element={<ProductDetail />} />
        
        {/* ... other routes ... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### Option B: If using separate routing file

```jsx
// src/routes/index.jsx
import { Navigate } from 'react-router-dom';
import SearchResults from '../pages/SearchResults/SearchResults';
import ProductDetail from '../pages/ProductDetail/ProductDetail';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/search',
    element: <SearchResults />,
  },
  {
    path: '/product/:slug',
    element: <ProductDetail />,
  },
  // ... other routes
];
```

#### Option C: Lazy Loading (Performance Optimization)

```jsx
// src/App.jsx
import { Suspense, lazy } from 'react';

const SearchResults = lazy(() => 
  import('./pages/SearchResults/SearchResults')
);
const ProductDetail = lazy(() => 
  import('./pages/ProductDetail/ProductDetail')
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/search" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SearchResults />
            </Suspense>
          } 
        />
        <Route 
          path="/product/:slug" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetail />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Navigation Examples

### From HeaderSearch to Results Page

The HeaderSearch component automatically handles navigation:

```jsx
// When user presses Enter or clicks search button
navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
```

### From HeaderSearch to Product Detail

When user clicks on a suggestion:

```jsx
// When user clicks a product in dropdown
navigate(`/product/${product.slug}`);
```

### Manual Navigation Examples

```javascript
// Programmatic navigation
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  // Navigate to search results
  const handleSearch = (keyword) => {
    navigate(`/search?keyword=${keyword}`);
  };

  // Navigate to product
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    // ...
  );
}
```

---

## Layout Structure (With Routes)

```
App.jsx (Router Setup)
├── Header (Contains HeaderSearch)
│   └── HeaderSearch.jsx
│       ├── Fetches API
│       ├── Shows dropdown
│       └── Navigates to /search or /product/:slug
│
├── Routes
│   ├── Route: /search
│   │   └── SearchResults.jsx
│   │       ├── Gets keyword from query params
│   │       ├── Fetches full results
│   │       └── Displays grid
│   │
│   └── Route: /product/:slug
│       └── ProductDetail.jsx
│
└── Footer
```

---

## Integration with Existing Header

If you already have a Header component:

```jsx
// src/Layout/Header/index.jsx (or Header.jsx)
import { useLocation } from 'react-router-dom';
import HeaderSearch from './components/HeaderSearch';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        {/* Logo, Menu, etc. */}
        
        {/* SEARCH - EMBEDDED EVERYWHERE */}
        <HeaderSearch />
        
        {/* User Menu, Notifications, etc. */}
      </div>
    </header>
  );
}
```

---

## URL Patterns

### Search Results Page
```
/search?keyword=iphone
/search?keyword=samsung%20galaxy
/search?keyword=điện%20thoại
```

### Product Detail Page
```
/product/iphone-15-pro
/product/samsung-galaxy-s24
/product/sản-phẩm-khác
```

### Query Parameters
```javascript
// Access in SearchResults.jsx
const [searchParams] = useSearchParams();
const keyword = searchParams.get('keyword'); // "iphone"
const page = searchParams.get('page');       // optional pagination
```

---

## Full Working Example

### Complete App.jsx Setup

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import Layout from './Layout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
const SearchResults = lazy(() => import('./pages/SearchResults'));

// Loading component
const LoadingPage = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <div>Loading...</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* SEARCH RESULTS ROUTE - WITH LAZY LOADING */}
          <Route 
            path="/search" 
            element={
              <Suspense fallback={<LoadingPage />}>
                <SearchResults />
              </Suspense>
            } 
          />
          
          {/* PRODUCT DETAIL ROUTE */}
          <Route 
            path="/product/:slug" 
            element={<ProductDetail />} 
          />
          
          {/* Other routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Layout.jsx (With Header)

```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header /> {/* Contains HeaderSearch */}
      <main className="main">
        <Outlet /> {/* Routes render here */}
      </main>
      <Footer />
    </>
  );
}
```

---

## Query Parameter Handling

### In SearchResults Component

```jsx
import { useSearchParams } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get keyword from URL
  const keyword = searchParams.get('keyword') || '';
  
  // Get other optional params
  const page = searchParams.get('page') || '1';
  const sortBy = searchParams.get('sort') || 'relevance';
  
  // Update URL when filters change
  const handleSortChange = (newSort) => {
    setSearchParams({ keyword, sort: newSort });
  };

  return (
    // Component JSX
  );
}
```

---

## Navigation Flow Diagram

```
┌─────────────────────────────────────┐
│     USER TYPES IN HEADER SEARCH     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   DROPDOWN SHOWS 8 SUGGESTIONS      │
│   (HeaderSearch component)          │
└─────────────────────────────────────┘
              ↓
         ┌────┴────┐
         │          │
    ┌────▼─────┐  ┌─▼──────────────┐
    │ Click    │  │ Press Enter    │
    │ Product  │  │ (or click btn) │
    └────┬─────┘  └─┬──────────────┘
         │          │
    ┌────▼──────────▼──────┐
    │ Navigate with keyword  │
    │ OR product slug       │
    └────┬──────────────────┘
         │
    ┌────┴──────────────────────────┐
    │                               │
    ▼                               ▼
┌──────────────────┐         ┌─────────────────────┐
│ /product/:slug   │         │ /search?keyword=... │
│ Product Detail   │         │ SearchResults Page  │
│ Page             │         │ (Full results grid) │
└──────────────────┘         └─────────────────────┘
```

---

## Nested Routes Example (Advanced)

If you have category/subcategory routes:

```jsx
<Route path="/category/:categorySlug" element={<Category />}>
  <Route path="search" element={<SearchResults />} />
  <Route path="product/:slug" element={<ProductDetail />} />
</Route>

// URLs would be:
// /category/dien-thoai/search?keyword=iphone
// /category/dien-thoai/product/iphone-15-pro
```

---

## Environment Configuration

### .env File

```bash
# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PRODUCT_DETAIL_ROUTE=/product
REACT_APP_SEARCH_ROUTE=/search
```

### Usage in Components

```javascript
// Get API URL
const apiUrl = process.env.REACT_APP_API_URL;

// Navigate to search
navigate(`${process.env.REACT_APP_SEARCH_ROUTE}?keyword=${keyword}`);

// Navigate to product
navigate(`${process.env.REACT_APP_PRODUCT_DETAIL_ROUTE}/${slug}`);
```

---

## Troubleshooting Routes

### Issue: Component not rendering
```jsx
// ✅ Correct
<Route path="/search" element={<SearchResults />} />

// ❌ Wrong
<Route path="/search" element={SearchResults} />

// ❌ Wrong
<Route path="/search" component={SearchResults} />
```

### Issue: Query params not working
```jsx
// ✅ Correct - Use useSearchParams
const [searchParams] = useSearchParams();
const keyword = searchParams.get('keyword');

// ❌ Wrong - Use useParams (only for path params)
const { keyword } = useParams(); // Won't work for query params
```

### Issue: Navigation not working from HeaderSearch
```jsx
// ✅ Correct - In component
const navigate = useNavigate();
navigate(`/search?keyword=${value}`);

// ❌ Wrong - Missing navigate
location.href = `/search?keyword=${value}`; // Causes full reload

// ❌ Wrong - Wrong path
navigate(`search?keyword=${value}`); // Missing leading /
```

---

## Performance Optimization

### Lazy Load SearchResults Page

```jsx
import { lazy, Suspense } from 'react';

const SearchResults = lazy(() => import('./pages/SearchResults'));

// In route
<Suspense fallback={<LoadingSpinner />}>
  <SearchResults />
</Suspense>
```

### Memoize Route Components

```jsx
import { memo } from 'react';

const SearchResults = memo(function SearchResults() {
  // Component code
});

export default SearchResults;
```

---

## Testing Routes

### Test Navigation

```javascript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';

test('search results page loads', () => {
  render(
    <MemoryRouter initialEntries={['/search?keyword=iphone']}>
      <SearchResults />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/iphone/i)).toBeInTheDocument();
});
```

---

## Migration Checklist

- [ ] Create routing file (if not exists)
- [ ] Import SearchResults component
- [ ] Add /search route
- [ ] Verify product detail route exists
- [ ] Add .env configuration
- [ ] Test search navigation
- [ ] Test product navigation
- [ ] Test back/forward buttons
- [ ] Test browser refresh
- [ ] Test mobile navigation

---

## Best Practices

1. **Always use leading slash** in navigate:
   ```jsx
   navigate('/search?keyword=...') // ✅
   navigate('search?keyword=...') // ❌
   ```

2. **Encode special characters** in URLs:
   ```jsx
   navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
   ```

3. **Use useNavigate in components**, not functions:
   ```jsx
   // ✅
   function Component() {
     const navigate = useNavigate();
   }
   
   // ❌
   function handleClick() {
     const navigate = useNavigate(); // Wrong!
   }
   ```

4. **Handle query params safely**:
   ```jsx
   const keyword = searchParams.get('keyword') || '';
   // Always provide fallback
   ```

---

**Now you're ready to integrate the search feature with routing!** 🚀

For more help, refer to:
- SEARCH_IMPLEMENTATION_GUIDE.md
- SEARCH_IMPLEMENTATION_SUMMARY.md
- SEARCH_QUICK_REFERENCE.md
