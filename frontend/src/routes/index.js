// layouts
import DefaultLayout from "../Layout/DefaultLayout";
import SettingsLayout from "../Layout/SidebarLayout";
// pages
import Home from "../pages/Home/Block_Cate_Banner";
import Register from "../pages/Register";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import InputEmailReset from "../pages/InputEmailReset";
import AccountSetting from "../pages/AccountSetting";
import CategoryPage from "../pages/CategoryPage";
import ProductDetail from "../pages/ProductDetail";
import ActiveSessionsPage from "../pages/ActiveSessionPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import AddressLisstPage from "../pages/AddressListPage";
import { ProtectedRoute } from "./Routes";

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
  },
  {
    path: "/account-setting",
    component: AccountSetting,
    layout: DefaultLayout,
    ProtectedRoute: true
  },
  {
    path: "/category/:slug",
    component: CategoryPage,
    layout: DefaultLayout
  },
  {
    path: "/product/:slug",
    component: ProductDetail,
    layout: DefaultLayout
  },
  {
    path: "/session",
    component: ActiveSessionsPage,
    layout: SettingsLayout,
    ProtectedRoute: true
  },
  {
    path: "/cart",
    component: CartPage,
    layout: DefaultLayout,
    ProtectedRoute: true
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: SettingsLayout,
    ProtectedRoute: true
  },
  {
    path: "/address",
    component: AddressLisstPage,
    layout: SettingsLayout,
    ProtectedRoute: true
  }
];

export default routes;