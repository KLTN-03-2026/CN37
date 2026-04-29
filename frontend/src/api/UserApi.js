import api from "./AxiosClient";

export const getCurrentUser = () => {
  return api.get("/users/me");
}

export const getUserList = (params) => {
  return api.get("/admin/users", { params });
};

export const getUserById = (id) => {
  return api.get(`/admin/users/${id}`);
};

export const createUser = (data) => {
  return api.post("/admin/users", data);
};

export const updateUser = (id, data) => {
  return api.put(`/admin/users/${id}`, data);
};

export const lockUser = (id) => {
  return api.post(`/admin/users/${id}/lock`);
};

export const unlockUser = (id) => {
  return api.post(`/admin/users/${id}/unlock`);
};

export const softDeleteUser = (id) => {
  return api.post(`/admin/users/${id}/soft-delete`);
};

export const assignUserRole = (id, roleId) => {
  return api.post(`/admin/users/${id}/assign-role`, { roleId });
};

export const removeUserRole = (id, roleId) => {
  return api.delete(`/admin/users/${id}/remove-role`, {roleId});
};