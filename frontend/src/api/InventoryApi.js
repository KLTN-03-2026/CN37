import api from "./AxiosClient";
import { getProduct } from "./ProductApi";

export const getProductInventory = async ({ search, category, status }) => {
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
  await api.post("/inventory/export", { productId, quantity });
};
