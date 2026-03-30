import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function CartButton() {
  const navigate = useNavigate();
  const handleCartClick = () => {
    navigate("/cart");
  }

  return (
    <button className={cx("cartBtn")} onClick={handleCartClick}>
      <FaShoppingCart /> Giỏ Hàng
    </button>
  );
}

export default CartButton;
