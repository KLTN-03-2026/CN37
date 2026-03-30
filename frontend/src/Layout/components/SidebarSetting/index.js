import classNames from "classnames/bind";
import styles from "./SidebarSettings.module.scss";
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);


export default function SidebarSettings() {
  return (
    <div className={cx("sidebar")}>
      <h2>Admin</h2>

      <NavLink to="/" end>
        Dashboard
      </NavLink>

      <NavLink to="/products">
        Sản phẩm
      </NavLink>

      <NavLink to="/orders">
        Đơn hàng
      </NavLink>
    </div>
  );
}