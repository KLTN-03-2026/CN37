import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import Logo from "./components/Logo";
import CategoryButton from "./components/CategoryButton";
import SearchBar from "./components/SearchBar";
import UserButton from "./components/UserButton";
import CartButton from "./components/CartButton";
import AdminButton from "./components/AdminButton";
import { getRolesFromToken } from "../../../helper/JwtDecodeHelper";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const roles = getRolesFromToken();
      setIsAdmin(roles.includes("ADMIN"));
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  return (
    <header className={cx("header")}>
      <div className={cx("container")}>
        <Logo />
        <CategoryButton />
        <SearchBar />

        <div className={cx("actions")}>
          <UserButton />
          <CartButton />
          {/* 🔥 NÚT ADMIN */}
          {isAdmin && <AdminButton />}
        </div>
      </div>
    </header>
  );
}

export default Header;
