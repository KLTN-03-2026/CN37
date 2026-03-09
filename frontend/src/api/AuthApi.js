import axios from 'axios'
const Api = axios.create({baseURL: "http://localhost:5235/api"});
export const verifyEmail = (token) =>(Api.get(`/auth/email-verify?token=${token}`));

export const logIn = (email, password) =>(Api.post(`/auth/login`));