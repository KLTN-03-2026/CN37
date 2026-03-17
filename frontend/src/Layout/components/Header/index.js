import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import Logo from "./components/Logo";
import CategoryButton from "./components/CategoryButton";
import SearchBar from "./components/SearchBar";
import UserButton from "./components/UserButton";
import CartButton from "./components/CartButton";

const cx = classNames.bind(styles);

function Header() {
  return (
    <header className={cx("header")}>
      <div className={cx("container")}>
        
        <Logo />

        <CategoryButton />

        <SearchBar />

        <div className={cx("actions")}>
          <UserButton />
          <CartButton />
        </div>

      </div>
    </header>
  );
}

export default Header;