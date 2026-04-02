import api from "./AxiosClient";

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (data) => {
  return api.post("/profile", data);
};

export const updateProfileAvatar = async (formData) => {
  const res = await api.post("/api/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};