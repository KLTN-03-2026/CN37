import api from "./AxiosClient"

export const getProducts = (slug) =>{
  return api.get(`/products?categorySlug=${slug}`)
}

export const getProduct = (slug) => {
    return api.get(`/products/${slug}`)
}

export const getAdminProduct = (search, parentCategoryId, categoryId) => {
  const res =  api.get("/products/admin" , {
    params: {
      search,
      parentCategoryId,
      categoryId,
    },
  })
  return res
}

export const getAdminProductId = (id) =>{
  return api.get(`/products/admin/${id}`)
}

export const createProduct = (data) => {
  return api.get(`/products/admin/${data}`)
}

export const updateProduct = (data) => {
  return api.get(`/products/admin/${data}`)
}

export const toggleProduct = (id) => {
  return api.get(`/products/admin/${id}`)
}