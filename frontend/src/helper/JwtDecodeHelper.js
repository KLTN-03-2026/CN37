import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      userId: decoded.sub,
      email: decoded.email,
    };
  } catch (err) {
    console.error("Decode token error:", err);
    return null;
  }
};