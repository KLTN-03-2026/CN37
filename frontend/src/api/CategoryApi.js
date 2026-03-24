import api from "./AxiosClient"

export const getCategories = () =>
  api.get("/categories");

export const getCategory = (slug) =>{
  return api.get(`/categories/${slug}`)
}

export const getProduct = (slug) =>{
  return api.get(`/products?categorySlug=${slug}`)
}