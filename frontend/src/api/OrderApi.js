import api from "./AxiosClient";

export const createOrder = (data) => {
  return api.post("/orders", data);
};