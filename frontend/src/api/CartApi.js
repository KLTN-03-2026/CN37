import api from "./AxiosClient";

export const getCart = () => {
  return api.get("/cart");
};

export const addToCart = (productId, quantity) => {
  return api.post("/cart/add", { productId, quantity });
};

export const updateCart = (data) => {
  return api.put("/cart/update", data);
};

export const removeItem = (productId) => {
  return api.delete(`/cart/remove/${productId}`);
};
