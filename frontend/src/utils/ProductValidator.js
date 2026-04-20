// utils/productValidator.js
export const ProductValidator = (data) => {
  if (!data.parentcategoryId) return "Vui lòng chọn danh mục cha";
  if (!data.categoryId) return "Vui lòng chọn danh mục con";
  if (!data.name?.trim()) return "Vui lòng nhập tên sản phẩm";
  if (!data.price || data.price <= 0) return "Giá phải lớn hơn 0";
  if (data.discountPrice < 0) return "Giá giảm không hợp lệ";
  if (data.discountPrice > data.price)
    return "Giá giảm phải nhỏ hơn hoặc bằng giá gốc";
  if (!data.description?.trim()) return "Vui lòng nhập mô tả";
  if (!data.images?.length && !data.newImages?.length)
    return "Phải có ít nhất 1 ảnh";
  if (!data.specifications?.length)
    return "Phải có ít nhất 1 thông số";

  return null;
};