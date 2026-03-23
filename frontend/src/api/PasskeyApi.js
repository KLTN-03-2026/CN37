import api from "./AxiosClient";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

export const registerPasskey = async (userId, email) => {
  try {
    const { data: options } = await api.post(`/passkey/register-options`, {
      userId,
      email,
    });

    const attResp = await startRegistration(options);

    await api.post(`/passkey/register-verify`, {
      userId,
      response: attResp,
    });
  } catch (error) {
    console.error("Error during passkey registration:", error);
    throw error;
  }
};

export const loginPasskey = async () => {
  try {
    // 1. lấy options
    const { data: options } = await api.post(`/passkey/login-options`);

    console.log("LOGIN OPTIONS:", options);

    // 2. xác thực
    const authResp = await startAuthentication(options);

    console.log("LOGIN RESPONSE:", authResp);

    // 3. verify → nhận JWT
    const { data } = await api.post(`/passkey/login-verify`, {
      response: authResp,
    });

    console.log("AUTH RESULT:", data);

    // 🔥 LƯU TOKEN
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;

  } catch (err) {
    console.error("LOGIN ERROR:", err);
  }
};
