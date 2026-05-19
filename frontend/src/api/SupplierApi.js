import api from "./AxiosClient";

// 👉 Lấy danh sách nhà cung cấp
export const getSuppliers = (params) => {
  return api.get("/admin/suppliers", { params });
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

export const exportToExcel = async () => {
  const response = await api.get("/admin/suppliers/export-excel", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "DanhSachNhaCungCap.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};