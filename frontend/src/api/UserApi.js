import api from "./AxiosClient";

export const getCurrentUser = () => {
  return api.get("/users/me");
}