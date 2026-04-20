import api from "./AxiosClient"

export const getProducts = (slug) =>{
  return api.get(`/products?categorySlug=${slug}`)
}

export const getProduct = (slug) => {
    return api.get(`/products/${slug}`)
}

export const createProduct = (data) => {
  return api.post("/products/admin", data);
};

export const getAdminProduct = (search, parentCategoryId, categoryId, status) => {
  const res =  api.get("/products/admin" , {
    params: {
      search,
      parentCategoryId,
      categoryId,
      status,
    },
  })
  return res
}

export const getAdminProductId = (id) =>{
  return api.get(`/products/admin/${id}`)
}

export const updateProduct = (id, form) => {
  return api.put(`/products/admin/${id}`, form);
};

export const toggleProduct = (id) => {
  return api.patch(`/products/admin/toggle-active/${id}`)
}