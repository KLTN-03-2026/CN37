import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function Reviews({ reviews = [] }) {
  return (
    <div className={cx("reviews")}>
      <h2>Customer Reviews</h2>
      {reviews.map(r => (
        <div key={r.id} className={cx("review")}>
          <strong>{r.user}</strong> <span>⭐ {r.rating}</span>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}