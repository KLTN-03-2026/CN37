import api from "./AxiosClient";

export const fetchCheckoutBuyNow = async (productId, quantity) => {
    const res = await api.get(  `/checkout/buy-now?productId=${productId}&quantity=${quantity}`);
    return res.data;
};

export const fetchCheckoutCart = async (items) => {
    const res = await api.post(`/checkout/from-cart-items`, { items });
    return res.data;
};