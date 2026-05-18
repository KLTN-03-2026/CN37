import api from "./AxiosClient";
import axios from "axios";

export const getVietnamBanks = () => {
  return axios.get("https://api.vietqr.io/v2/banks");
};

export const getBankAccounts = () => {
  return api.get("/bank-accounts");
};

export const createBankAccount = (data) => {
  return api.post("/bank-accounts", data);
};

export const deleteBankAccount = (id) => {
  return api.delete(`/bank-accounts/${id}`);
};