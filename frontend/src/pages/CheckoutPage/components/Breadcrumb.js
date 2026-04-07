import classNames from "classnames/bind";
import styles from "./Breadcrumb.module.scss";
import { IoIosArrowBack } from "react-icons/io";


const cx = classNames.bind(styles);

function Breadcrumb({ category }) {
  return (
    <div className={cx("breadcrumb")}>
      <a href="/cart"><IoIosArrowBack />Quay lại giỏ hàng</a>
    </div>
  );
}

export default Breadcrumb;