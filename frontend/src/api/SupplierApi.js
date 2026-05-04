import api from "./AxiosClient";

// 👉 Lấy danh sách nhà cung cấp
export const getSuppliers = (params) => {
  return api.get(`/admin/suppliers`, { params });
};

// 👉 Lấy chi tiết 1 supplier
export const getSupplierById = (id) => {
  return api.get(`/admin/suppliers/${id}`);
};

// 👉 Tạo supplier mới
export const createSupplier = (data) => {
  return api.post(`/admin/suppliers`, data);
};

// 👉 Cập nhật supplier
export const updateSupplier = (id, data) => {
  return api.put(`/admin/suppliers/${id}`, data);
};

// 👉 Xóa supplier
export const deleteSupplier = (id) => {
  return api.delete(`/admin/suppliers/${id}`);
};