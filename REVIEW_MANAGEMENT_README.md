# 🎯 Hệ thống Quản lý Đánh giá Sản phẩm

Hệ thống quản lý đánh giá sản phẩm hoàn chỉnh cho website thương mại điện tử, tương tự như Shopee/TikTok Shop.

## 📋 Tính năng chính

### 1. **Xem & Lọc Đánh giá**
- ✅ Xem danh sách tất cả đánh giá sản phẩm
- ✅ Lọc theo số sao (1⭐ - 5⭐)
- ✅ Lọc theo loại: Có ảnh, Chỉ text, Chưa trả lời
- ✅ Phân trang với kích thước tùy chỉnh

### 2. **Thống kê Đánh giá**
- 📊 Điểm đánh giá trung bình
- 📊 Tổng số đánh giá
- 📊 Phân bố đánh giá theo sao
- 📊 Số đánh giá có hình ảnh
- 📊 Số đánh giá chưa có câu trả lời

### 3. **Trả lời Đánh giá**
- 💬 Viết câu trả lời cho từng đánh giá
- 💬 Cập nhật câu trả lời
- 💬 Xóa câu trả lời
- 💬 Hiển thị badge "Người bán" trên câu trả lời

### 4. **Giao diện Hiện đại**
- 🎨 Design tương tự Shopee/TikTok Shop
- 🎨 Responsive trên mọi thiết bị (desktop, tablet, mobile)
- 🎨 Gradient, shadow, animation mượt mà
- 🎨 Modal xem ảnh full-screen

---

## 🔧 Cấu trúc Kỹ thuật

### **Backend (ASP.NET Core)**

#### Entities
```
ReviewReply.cs - Thực thể lưu trữ câu trả lời đánh giá
```

#### DTOs
```
ReviewManagementDto - DTO cho quản lý đánh giá
ReviewReplyDto - DTO cho câu trả lời
ReviewStatisticsDto - DTO cho thống kê
```

#### Controllers
```
ReviewController - Endpoints:
  GET /api/reviews/management/all - Lấy danh sách đánh giá
  GET /api/reviews/management/statistics - Lấy thống kê
  POST /api/reviews/management/reply - Thêm câu trả lời
  PUT /api/reviews/management/reply/{id} - Cập nhật câu trả lời
  DELETE /api/reviews/management/reply/{id} - Xóa câu trả lời
```

#### Services & Repositories
```
IReviewService / ReviewService - Logic xử lý
IReviewRepository / ReviewRepository - Truy cập dữ liệu
```

#### Database
```
ReviewReplies - Bảng lưu trữ câu trả lời
  - Id (PK)
  - ReviewId (FK)
  - UserId (FK)
  - Reply (text)
  - CreatedAt
  - UpdatedAt
```

### **Frontend (React + SCSS)**

#### Components
```
ReviewManagement.js - Trang chính
  ├── ReviewStatistics.js - Hiển thị thống kê
  ├── ReviewList.js - Danh sách đánh giá
  └── ReviewManagement.module.scss - Styles
```

#### API Service
```
ReviewManagementApi.js - Các hàm gọi API:
  - getAll() - Lấy danh sách
  - getStatistics() - Lấy thống kê
  - addReply() - Thêm câu trả lời
  - updateReply() - Cập nhật
  - deleteReply() - Xóa
```

---

## 🚀 Hướng dẫn Cài đặt

### **Backend Setup**

1. **Cập nhật Database Migration**
```bash
cd backend
dotnet ef database update
```

2. **Đảm bảo các service đã được đăng ký trong Program.cs**
```csharp
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();
```

3. **Chạy backend**
```bash
dotnet run
```

### **Frontend Setup**

1. **Cài đặt dependencies**
```bash
cd frontend
npm install
```

2. **Thêm route vào navigation** (nếu cần)
```javascript
import ReviewManagement from "./pages/Seller/ReviewManagement/ReviewManagement";

// Trong router
<Route path="/seller/reviews" element={<ReviewManagement />} />
```

3. **Chạy frontend**
```bash
npm start
```

---

## 📱 API Endpoints Chi tiết

### **GET /api/reviews/management/all**
Lấy danh sách đánh giá với bộ lọc

**Query Parameters:**
```
productId (long?) - ID sản phẩm
rating (int?) - Số sao (1-5)
hasImages (bool?) - Có ảnh
noReply (bool?) - Chưa trả lời
page (int) - Trang (default: 1)
pageSize (int) - Số lượng/trang (default: 10)
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "productId": 100,
      "productName": "Sản phẩm A",
      "rating": 5,
      "comment": "Sản phẩm tốt",
      "email": "user@email.com",
      "avatar": "url",
      "hasImages": true,
      "hasReply": true,
      "replyContent": "Cảm ơn bạn",
      "createdAt": "2026-05-08T...",
      "images": ["url1", "url2"]
    }
  ],
  "page": 1,
  "pageSize": 10
}
```

### **GET /api/reviews/management/statistics**
Lấy thống kê đánh giá

**Response:**
```json
{
  "totalReviews": 100,
  "averageRating": 4.5,
  "ratingCount": {
    "5": 50,
    "4": 30,
    "3": 15,
    "2": 3,
    "1": 2
  },
  "reviewsWithImages": 45,
  "reviewsWithoutReply": 25
}
```

### **POST /api/reviews/management/reply**
Thêm câu trả lời

**Body:**
```json
{
  "reviewId": 1,
  "reply": "Cảm ơn bạn đã mua sản phẩm của chúng tôi!"
}
```

### **PUT /api/reviews/management/reply/{replyId}**
Cập nhật câu trả lời

### **DELETE /api/reviews/management/reply/{replyId}**
Xóa câu trả lời

---

## 🎨 UI/UX Features

### **Statistics Card**
- Thẻ thống kê với gradient background
- Biểu đồ phân bố sao
- Animation hover và pulse

### **Review Card**
- Avatar người đánh giá
- Hiển thị số sao
- Hình ảnh đánh giá (thumbnail)
- Badge trạng thái (Có ảnh, Đã trả lời, Chưa trả lời)
- Modal xem ảnh full-screen

### **Reply Section**
- Textarea input với styling
- Nút gửi/hủy
- Hiển thị câu trả lời của người bán
- Badge "Người bán" xanh lá

### **Filters**
- Button filter theo sao
- Button filter theo loại
- Active state với gradient
- Responsive trên mobile

---

## 📊 Database Schema

### **ReviewReply Table**
```sql
CREATE TABLE ReviewReplies (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    ReviewId BIGINT NOT NULL,
    UserId BIGINT NOT NULL,
    Reply NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ReviewId) REFERENCES Reviews(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES users(Id) ON DELETE RESTRICT,
    UNIQUE (ReviewId)
);

CREATE INDEX IX_ReviewReplies_ReviewId ON ReviewReplies(ReviewId);
CREATE INDEX IX_ReviewReplies_UserId ON ReviewReplies(UserId);
```

---

## 🔐 Authorization

Tất cả endpoints quản lý đều yêu cầu **Authorize** (Bearer Token):
- Người bán có thể xem/trả lời đánh giá sản phẩm của họ
- Admin có thể xem/trả lời tất cả đánh giá

---

## 🎯 Best Practices

1. **Caching** - Cache thống kê nếu có nhiều đánh giá
2. **Pagination** - Luôn phân trang để tránh quá tải
3. **Validation** - Validate độ dài câu trả lời trước khi gửi
4. **Error Handling** - Hiển thị message lỗi rõ ràng
5. **Responsive Design** - Test trên mobile và tablet
6. **Performance** - Lazy load ảnh, optimize query

---

## 🐛 Troubleshooting

### **Lỗi: API không tìm thấy**
- Kiểm tra REACT_APP_API_URL trong .env.local
- Đảm bảo backend đang chạy trên đúng port

### **Lỗi: Token hết hạn**
- Refresh token sử dụng endpoint đã có sẵn
- Kiểm tra localStorage có token

### **Lỗi: Database migration**
```bash
dotnet ef migrations add AddReviewReplyFeature
dotnet ef database update
```

---

## 📝 Notes

- Một đánh giá chỉ có một câu trả lời (UNIQUE constraint)
- Người bán có thể cập nhật/xóa câu trả lời của họ
- Khách hàng có thể xem câu trả lời nhưng không thể chỉnh sửa
- Thống kê được tính real-time từ database

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Console log trên browser (F12)
2. Network tab để xem response API
3. SQL Server để kiểm tra data

---

**Version:** 1.0.0  
**Last Updated:** May 8, 2026
