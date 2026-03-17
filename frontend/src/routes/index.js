// layouts
import DefaultLayout from "../Layout/DefaultLayout";
// pages
import Home from "../pages/Home";
import Register from "../pages/Register";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";

const routes = [
  {
    path: "/",
    component: Home,
    layout: DefaultLayout
  },
  {
    path: "/register",
    component: Register,
    layout: DefaultLayout,
    publicOnly: true
  },
  {
    path: "/login",
    component: LogIn,
    layout: DefaultLayout,
    publicOnly: true
  },
  {
    path: "/email-verify",
    component: VerifyEmail,
    layout: DefaultLayout,
  }
];

export default routes;