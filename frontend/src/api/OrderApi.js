import api from "./AxiosClient";

export const createOrder = (data) => {
  return api.post("/orders", data);
};

export const getOrders = (params) =>{
  return api.get("/orders", { params });
};

export const cancelOrder = (id) =>{
  return api.post(`/orders/${id}/cancel`);
};

export const updateAddress = (id, addressId) => {
  return api.put(`/orders/${id}/address`, { addressId });
};