import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const cx = classNames.bind(styles);

function CartButton() {
  return (
    <button className={cx("cartBtn")}>
      <FaShoppingCart /> Giỏ Hàng
    </button>
  );
}

export default CartButton;
