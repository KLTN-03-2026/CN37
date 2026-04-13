import api from "./AxiosClient";

export const getCategories = () => api.get("/categories");

export const getCategory = (slug) => {
  return api.get(`/categories/${slug}`);
};

export const getAdminCategory = async({search}) => {
  const res = await api.get("/categories/admin", {
    params: {
      search,
    },
  });
  return res.data;
};

export const createCategory = (data) => {
  return api.post("/categories/admin", data);
};

export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
