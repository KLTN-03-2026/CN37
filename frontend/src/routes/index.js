import LogIn from "pages/LogIn";    
import Register from "pages/Register";
import VerifyEmail from "pages/VerifyEmail"

const publicRoutes = [
  { path: "/login", component: LogIn },
  { path: "/register", component: Register },
  { path: "/email-verify", component: VerifyEmail}
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };