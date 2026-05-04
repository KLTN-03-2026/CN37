import api from "./AxiosClient";
import { getProduct } from "./ProductApi";

export const getProductInventory = async (search, category, status) => {
  const res = await api.get("/inventory", {
    params: {
      search,
      categorySlug: category,
      status,
    },
  });
  return res.data;
};

export const importInventory = async (productId, quantity) => {
  return await api.post("/inventory/import", { productId, quantity });
};

export const exportInventory = async (productId, quantity) => {
  return await api.post("/inventory/export", { productId, quantity });
};

export const getAllInventoryLogs = () => {
  return api.get("/inventory/logs");
};

// 👉 Lấy danh sách phiếu nhập
export const getImports = (search) => {
  return api.get("/api/imports", {
    params: { search },
  });
};

// 👉 Tạo phiếu nhập
export const createImport = (data) => {
  return api.post(`/inventory-documents/import`, data);
};

export const createExport = (data) => {
  return api.post("/inventory-documents/export", data);
};
