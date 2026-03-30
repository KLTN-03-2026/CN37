import { removeItem } from "../../../api/CartApi";
import styles from "../Cart.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";


const cx = classNames.bind(styles);

function CartItem({ item, onUpdate, onRemove, checked, onCheck }) {
  const price = item.discountPrice || item.price;

  return (
    
    <div className={cx("cart-item")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheck(item.productId, e.target.checked)}
      />

      <img src={item.thumbnail} alt="" className={cx("thumb")} />

      <div className={cx("info")}>
        <h4>{item.name}</h4>

        <div className={cx("price")}>
          {item.discountPrice && (
            <span className={cx("old")}>{item.price.toLocaleString()}đ</span>
          )}
          <span className={cx("new")}>{price.toLocaleString()}đ</span>
        </div>
      </div>

      <div className={cx("quantity")}>
        <button onClick={() => onUpdate(item.productId, item.quantity - 1)}>
          -
        </button>
        <input value={item.quantity} readOnly />
        <button onClick={() => onUpdate(item.productId, item.quantity + 1)}>
          +
        </button>
      </div>

      <button className={cx("remove")} onClick={() => onRemove(item.productId)}>
        <FaTrashCan />
      </button>
      
    </div>   
  );
}

export default CartItem;
