import api from "./AxiosClient";

export const fetchCheckoutBuyNow = async (productId, quantity) => {
    const res = await api.get(  `/checkout/buy-now?productId=${productId}&quantity=${quantity}`);
    return res.data;
};

export const fetchCheckoutCart = async (orderRequest) => {
    const res = await api.get(`/checkout/cart?productId=${ orderRequest.items.map(item => item.productId).join(',')}&quantity=${orderRequest.items.map(item => item.quantity).join(',')}`);
    return res.data;
};