import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function ProductInfo({ product }) {
  const { name, brand, price, discount_price, rating_avg, rating_count } = product;

  return (
    <div className={cx("info")}>
      <h1 className={cx("name")}>{name}</h1>
      <p className={cx("brand")}>{brand}</p>

      <div className={cx("price")}>
        {discount_price ? (
          <>
            <span className={cx("discount")}>${discount_price}</span>
            <span className={cx("original")}>${price}</span>
          </>
        ) : (
          <span>${price}</span>
        )}
      </div>

      <div className={cx("rating")}>
        <span>{`⭐ ${rating_avg} (${rating_count} reviews)`}</span>
      </div>

      <button className={cx("add-to-cart")}>Add to Cart</button>
    </div>
  );
}