import LogIn from "pages/LogIn";    
import Register from "pages/Register";

const publicRoutes = [
  { path: "/login", component: LogIn },
  { path: "/register", component: Register },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };