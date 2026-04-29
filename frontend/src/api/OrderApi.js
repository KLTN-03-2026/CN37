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

export const getAdminOrders = (params) => {
  return api.get("/orders/admin", { params });
};

export const getAdminCountByStatus = () => {
  return api.get("/orders/admin/count");
};

export const getCountByStatus = () => {
  return api.get("/orders/count");
};

export const editOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, { id, status });
};