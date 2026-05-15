/**
 * ReviewManagementSetup.md - Hướng dẫn Setup Chi tiết
 */

# SETUP GUIDE - Quản lý Đánh giá Sản phẩm

## ✅ Checklist Setup

### Backend

- [ ] **1. Tạo ReviewReply Entity**
  - File: `backend/Entities/ReviewReply.cs`
  - ✓ Đã tạo

- [ ] **2. Tạo DTOs**
  - `backend/DTOs/ReviewManagementDto.cs` ✓
  - `backend/DTOs/ReviewReplyDto.cs` ✓
  - `backend/DTOs/ReviewStatisticsDto.cs` ✓

- [ ] **3. Cập nhật DbContext**
  - Thêm `DbSet<ReviewReply> ReviewReplies` ✓

- [ ] **4. Cập nhật Repository**
  - `backend/Repositories/ReviewRepository.cs`
  - Thêm methods: GetAllAsync, GetStatisticsAsync, GetReplyByReviewIdAsync, AddReplyAsync, UpdateReplyAsync, DeleteReplyAsync ✓

- [ ] **5. Cập nhật Service**
  - `backend/Services/ReviewService.cs`
  - Thêm methods management ✓

- [ ] **6. Cập nhật Interface**
  - `backend/Services/Interfaces/IReviewService.cs` ✓

- [ ] **7. Cập nhật Controller**
  - `backend/Controllers/ReviewController.cs`
  - Thêm management endpoints ✓

- [ ] **8. Tạo Migration**
  - `backend/Migrations/20260508_AddReviewReplyFeature.cs` ✓

- [ ] **9. Update Database**
  ```bash
  cd backend
  dotnet ef database update
  ```

### Frontend

- [ ] **1. Tạo API Service**
  - `frontend/src/api/ReviewManagementApi.js` ✓

- [ ] **2. Tạo Components**
  - `frontend/src/pages/Seller/ReviewManagement/ReviewManagement.js` ✓
  - `frontend/src/pages/Seller/ReviewManagement/components/ReviewStatistics.js` ✓
  - `frontend/src/pages/Seller/ReviewManagement/components/ReviewList.js` ✓

- [ ] **3. Tạo Styles**
  - `frontend/src/pages/Seller/ReviewManagement/ReviewManagement.module.scss` ✓

- [ ] **4. Thêm Route** (trong App.js hoặc Router)
  ```javascript
  import ReviewManagement from "./pages/Seller/ReviewManagement/ReviewManagement";
  
  // Route
  <Route path="/seller/reviews" element={<ReviewManagement />} />
  ```

---

## 📝 Program.cs Configuration

Đảm bảo trong `backend/Program.cs` có:

```csharp
// Add services
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();

// Add CORS (nếu frontend khác domain)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Use CORS
app.UseCors("AllowFrontend");

// Map controllers
app.MapControllers();
```

---

## 🌐 Frontend Environment

Tạo file `.env.local` trong thư mục `frontend`:

```env
REACT_APP_API_URL=https://localhost:7001/api
REACT_APP_API_TIMEOUT=10000
```

---

## 🧪 Testing APIs

### Test với Postman/Thunder Client

**1. Get All Reviews**
```
GET https://localhost:7001/api/reviews/management/all?page=1&pageSize=10&rating=5
Headers: Authorization: Bearer {token}
```

**2. Get Statistics**
```
GET https://localhost:7001/api/reviews/management/statistics
Headers: Authorization: Bearer {token}
```

**3. Add Reply**
```
POST https://localhost:7001/api/reviews/management/reply
Headers: Authorization: Bearer {token}
Body: {
  "reviewId": 1,
  "reply": "Cảm ơn bạn!"
}
```

**4. Update Reply**
```
PUT https://localhost:7001/api/reviews/management/reply/1
Headers: Authorization: Bearer {token}
Body: {
  "reviewId": 1,
  "reply": "Updated reply"
}
```

**5. Delete Reply**
```
DELETE https://localhost:7001/api/reviews/management/reply/1
Headers: Authorization: Bearer {token}
```

---

## 🎯 Features Checklist

### Quản lý Đánh giá
- [x] Xem danh sách đánh giá
- [x] Lọc theo số sao
- [x] Lọc theo loại (có ảnh, chỉ text, chưa trả lời)
- [x] Phân trang
- [x] Hiển thị thông tin khách hàng

### Thống kê
- [x] Điểm trung bình
- [x] Tổng số đánh giá
- [x] Phân bố theo sao
- [x] Số đánh giá có ảnh
- [x] Số đánh giá chưa trả lời

### Trả lời
- [x] Thêm câu trả lời
- [x] Cập nhật câu trả lời
- [x] Xóa câu trả lời
- [x] Hiển thị status đã trả lời

### UI/UX
- [x] Gradient background
- [x] Responsive design
- [x] Modal xem ảnh
- [x] Animation & hover effects
- [x] Badge & status indicators
- [x] Loading states

---

## 🔍 Verification Steps

1. **Backend Migration**
   ```bash
   # Kiểm tra table ReviewReplies đã tạo
   SELECT * FROM ReviewReplies;
   ```

2. **API Testing**
   - Test GET /api/reviews/management/all
   - Test GET /api/reviews/management/statistics
   - Test POST /api/reviews/management/reply

3. **Frontend**
   - Navigate tới /seller/reviews
   - Kiểm tra thống kê hiển thị
   - Test filter & pagination
   - Test trả lời đánh giá

---

## 🚀 Deployment

### Production Backend
```bash
cd backend
dotnet publish -c Release
# Upload to server
```

### Production Frontend
```bash
cd frontend
npm run build
# Upload build folder to server
```

---

## 📊 Database Backup

```sql
-- Backup ReviewReplies
SELECT * 
INTO ReviewReplies_Backup 
FROM ReviewReplies;
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 Not Found | Kiểm tra route/controller mapping |
| 401 Unauthorized | Kiểm tra token & authorization |
| CORS Error | Cấu hình CORS trong Program.cs |
| Database Error | Chạy `dotnet ef database update` |
| Images not loading | Kiểm tra REACT_APP_API_URL |

---

## 📞 Quick Support

**Frontend Issues:**
- F12 → Console → xem error messages
- Network tab → xem API responses

**Backend Issues:**
- Kiểm tra console output
- Xem Event Viewer (Windows)
- Kiểm tra SQL Server logs

---

**Setup Date:** May 8, 2026  
**Status:** ✅ Complete
