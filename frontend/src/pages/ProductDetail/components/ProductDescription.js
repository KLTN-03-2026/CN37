import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function ProductDescription({ description }) {
  return (
    <div className={cx("description")}>
      <h2>Description</h2>
      <p>{description}</p>
    </div>
  );
}