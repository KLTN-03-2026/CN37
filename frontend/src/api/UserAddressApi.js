import api from "./AxiosClient";

export const getAddresses = () => api.get("/user-addresses");
export const addAddress = (data) => api.post("/user-addresses/add", {ReceiverName: data.receiver_name, Phone: data.phone, Province: data.province, District: data.district, Ward: data.ward, AddressDetail: data.address_detail, IsDefault: data.is_default});
export const updateAddress = (id, data) => api.put(`/user-addresses/${id}`, {ReceiverName: data.receiver_name, Phone: data.phone, Province: data.province, District: data.district, Ward: data.ward, AddressDetail: data.address_detail, IsDefault: data.is_default});
export const deleteAddress = (id) => api.delete(`/user-addresses/${id}`);
export const setDefaultAddress = (id) => api.put(`/user-addresses/default/${id}`);