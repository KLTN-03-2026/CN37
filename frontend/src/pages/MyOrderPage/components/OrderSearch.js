import classNames from "classnames/bind";
import styles from "./OrderSearch.module.scss";

const cx = classNames.bind(styles);

export default function OrderSearch({ onSearch }) {
  return (
    <div className={cx("searchBox")}>
      <input
        placeholder="Tìm theo tên sản phẩm..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}