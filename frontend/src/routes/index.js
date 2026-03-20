// layouts
import DefaultLayout from "../Layout/DefaultLayout";
// pages
import Home from "../pages/Home/Block_Cate_Banner";
import Register from "../pages/Register";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import InputEmailReset from "../pages/InputEmailReset";

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
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    layout: DefaultLayout,
    publicOnly: true
  },
  {
    path: "/input-email-reset",
    component: InputEmailReset,
    layout: DefaultLayout,
    publicOnly: true
  }
];

export default routes;