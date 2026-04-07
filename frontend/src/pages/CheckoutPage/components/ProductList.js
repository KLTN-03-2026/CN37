import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";

const cx = classNames.bind(styles);

export default function ProductList({ items }) {
  return (
    <div className={cx("card")}>
      <div className={cx("cardTitle")}>Sản phẩm trong đơn</div>

      {items.map(item => (
        <div className={cx("productItem")} key={item.productId}>
          
          <img
            src={item.thumbnail}
            alt={item.name}
            className={cx("productImage")}
          />

          <div className={cx("productInfo")}>
            <div className={cx("productName")}>{item.name}</div>

            <div className={cx("productMeta")}>
              <span className={cx("productPrice")}>
                {(item.price ?? 0).toLocaleString()} đ
              </span>

              <span className={cx("productQty")}>
                x{item.quantity}
              </span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}