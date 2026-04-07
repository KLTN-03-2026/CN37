import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.roles || [] // đảm bảo luôn có mảng roles
    };
  } catch (err) {
    console.error("Decode token error:", err);
    return null;
  }
};

export const getRolesFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
  } catch (err) {
    console.error("Decode token error:", err);
    return [];
  }
};
