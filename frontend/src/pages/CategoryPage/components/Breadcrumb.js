import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

function Breadcrumb({ category }) {
  return (
    <div className={cx("breadcrumb")}>
      <a href="/">Trang chủ</a> / <span>{category.name}</span>
    </div>
  );
}

export default Breadcrumb;
