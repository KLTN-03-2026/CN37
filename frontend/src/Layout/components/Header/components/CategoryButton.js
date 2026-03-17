import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { FaBars } from "react-icons/fa";

const cx = classNames.bind(styles);

function CategoryButton() {
  return (
    <button className={cx("categoryBtn")}>
      <FaBars />
      Danh mục
    </button>
  );
}

export default CategoryButton;
