import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";

const cx = classNames.bind(styles);

function Breadcrumb({ product }) {
  return (
    <div className={cx("breadcrumb")}>
      <a href="/">Trang chủ</a> / <span>{product.name}</span>
    </div>
  );
}

export default Breadcrumb;
