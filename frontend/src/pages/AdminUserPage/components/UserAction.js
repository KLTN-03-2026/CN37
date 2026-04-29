import classNames from "classnames/bind";
import styles from "./UserAction.module.scss";
import { IoMdSearch } from "react-icons/io";

const cx = classNames.bind(styles);

export default function UserAction({ isOpen, setIsOpen }) {
  return (
    <div className={cx("wrapper")}>
      <button
        className={cx("btn", "btnSearch")}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Đóng bộ lọc ▲" : "Mở bộ lọc ▼"}
      </button>
      <button
        className={cx("btn", "btnAdd")}
        onClick={() => setIsOpen(!isOpen)}
      >
        Thêm mới TK
      </button>
    </div>
  );
}