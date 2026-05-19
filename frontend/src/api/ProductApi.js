import api from "./AxiosClient";

export const searchProducts = async (keyword) => {
  if (!keyword?.trim()) return [];

  const res = await api.get("/products/search", {
    params: { keyword },
  });

  return res.data;
};

export const getProductfilter = (params) => {
  return api.get(`/products?${params}`);
};

export const getProducts = (slug) => {
  return api.get(`/products?categorySlug=${slug}`);
};

export const getProduct = (slug) => {
  return api.get(`/products/${slug}`);
};

export const createProduct = (data) => {
  return api.post("/products/admin", data);
};

export const getAdminProduct = (
  search,
  parentCategoryId,
  categoryId,
  status,
) => {
  const res = api.get("/products/admin", {
    params: {
      search,
      parentCategoryId,
      categoryId,
      status,
    },
  });
  return res;
};

export const getAdminProductId = (id) => {
  return api.get(`/products/admin/${id}`);
};

export const updateProduct = (id, form) => {
  return api.put(`/products/admin/${id}`, form);
};

export const toggleProduct = (id) => {
  return api.patch(`/products/admin/toggle-active/${id}`);
};

export const exportToExcel = async () => {
  const response = await api.get("/products/export-excel", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "DanhSachSanPham.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
