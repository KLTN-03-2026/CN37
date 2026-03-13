import api from "./AxiosClient"

export const getUser = () => {
    return api.get("/users/me");
};