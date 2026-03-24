import api from "./AxiosClient"

export const getProducts = (slug) =>{
  return api.get(`/products?categorySlug=${slug}`)
}

export const getProduct = (slug) => {
    return api.get(`/products/${slug}`)
}