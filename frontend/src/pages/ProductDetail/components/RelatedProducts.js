import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function RelatedProducts({ products = [] }) {
  return (
    <div className={cx("related")}>
      <h2>Related Products</h2>
      <div className={cx("list")}>
        {products.map(p => (
          <div key={p.id} className={cx("card")}>
            <img src={p.thumbnail} alt={p.name} />
            <p>{p.name}</p>
            <p className={cx("price")}>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}