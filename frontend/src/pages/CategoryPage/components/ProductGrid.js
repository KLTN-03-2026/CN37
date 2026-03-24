import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

export default function ProductGrid({ products }) {
  return (
    <div className={cx("grid")}>
      {products.map((p) => (
        <div key={p.id} className={cx("card")}>
          {/* IMAGE */}
          <div className={cx("image-wrap")}>
            <img src={p.thumbnail} alt={p.name} />

            {p.discountPercent && (
              <span className={cx("badge")}>
                -{p.discountPercent}%
              </span>
            )}
          </div>

          {/* NAME */}
          <h4 className={cx("name")}>{p.name}</h4>

          {/* SPEC */}
          <div className={cx("specs")}>
            {p.specs?.slice(0, 3).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>

          {/* PRICE */}
          <div className={cx("price-box")}>
            <span className={cx("price-sale")}>
              {p.price.toLocaleString()}đ
            </span>

            {p.discountPrice && (
              <span className={cx("price-original")}>
                {p.discountPrice.toLocaleString()}đ
              </span>
            )}
          </div>

          {/* RATING */}
          <div className={cx("rating")}>
            ⭐ {p.rating}
            <span>({p.reviewCount})</span>
          </div>

          {/* BUTTON */}
          <div className={cx("actions")}>
            <button className={cx("buy-now")}>Mua ngay</button>
            <button className={cx("add-cart")}>🛒</button>
          </div>
        </div>
      ))}
    </div>
  );
}