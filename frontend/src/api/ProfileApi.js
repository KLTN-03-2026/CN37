import api from "./AxiosClient";

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (data) => {
  return api.post("/profile", data);
};