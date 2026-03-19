import api from "./AxiosClient"

export const getCategories = () =>
  api.get("/categories");