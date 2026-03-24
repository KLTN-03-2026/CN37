import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

export default function ProductGrid({ products }) {
  return (
    <div className={cx("grid")}>
      {products.map((p) => (
        <div key={p.id} className={cx("card")}>
          <div className={cx("image-wrap")}>
            <img src={p.thumbnail} alt={p.name} />
          </div>

          <h4 className={cx("name")}>{p.name}</h4>

          <p className={cx("price")}>
            {p.price.toLocaleString()}đ
          </p>

          <button className={cx("btn")}>Xem chi tiết</button>
        </div>
      ))}
    </div>
  );
}