import api from "./AxiosClient"

export const verifyEmail = (token) =>
  api.get(`/auth/email-verify?token=${token}`);

export const logIn = (email, password) =>
  api.post(`/auth/login`, { Email: email, Password: password });

export const register = (email, password, confirmPassword) =>
  api.post(`/auth/register`, { Email: email, Password: password, ConfirmPassword: confirmPassword });

export const logOut = (refreshToken) =>{
  api.post(`/auth/logout`, {refreshToken: refreshToken});
}

export const requestPasswordReset = (email) =>
  api.post(`/auth/forgot-password`, { Email: email });

export const resetPassword = (token, password, confirmPassword) =>
  api.post(`/auth/reset-password`, { Token: token, Password: password, ConfirmPassword: confirmPassword });

