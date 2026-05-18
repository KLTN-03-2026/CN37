import api from "./AxiosClient";

export const createRefundRequest = (orderId, data) => {
  return api.post(`/refunds/orders/${orderId}`, data);
};

export const getRefundDetails = () => {
  return api.get(`/refunds`);
};

export const confirmRefund = (refundId) => {
  return api.post(`/refunds/${refundId}/confirm`);
};