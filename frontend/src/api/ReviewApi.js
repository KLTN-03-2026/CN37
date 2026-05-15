import api from "./AxiosClient";

export const createReview = (formData) => {
    return api.post("/reviews", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getReview = (productId) => {
    return api.get(`/reviews/product/${productId}`);
};