import api from "./AxiosClient";

export const getAllRole = () => {
    return api.get("/role/all");
}