import { getRolesFromToken } from "../helper/JwtDecodeHelper";
import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return <Navigate to="/"></Navigate>;
  }
  return children;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login"></Navigate>;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const role = getRolesFromToken();

  if (!role.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export { PublicRoutes, ProtectedRoute, AdminRoute };
