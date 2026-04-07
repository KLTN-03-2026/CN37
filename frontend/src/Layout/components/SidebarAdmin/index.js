import { useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./SidebarAdmin.module.scss";

import {
  FaBox,
  FaList,
  FaShoppingCart,
  FaWarehouse,
  FaUsers,
  FaChartBar,
  FaBars,
} from "react-icons/fa";

const cx = classNames.bind(styles);

export default function SidebarAdmin() {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Quản lý danh mục", path: "/admin/categories", icon: <FaList /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FaBox /> },
    { name: "Quản lý đơn hàng", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Quản lý kho", path: "/admin/inventory", icon: <FaWarehouse /> },
    { name: "Quản lý khách hàng", path: "/admin/customers", icon: <FaUsers /> },
    { name: "Báo cáo thống kê", path: "/admin/reports", icon: <FaChartBar /> },
  ];

  return (
    <div className={cx("sidebar", { collapsed })}>
      {/* Toggle button (mobile) */}
      <div className={cx("toggle")} onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </div>

      <div className={cx("menu")}>
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              cx("item", { active: isActive })
            }
          >
            <span className={cx("icon")}>{item.icon}</span>
            {!collapsed && <span className={cx("text")}>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}