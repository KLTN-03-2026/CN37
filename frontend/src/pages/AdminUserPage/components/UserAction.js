import classNames from "classnames/bind";
import styles from "./UserAction.module.scss";
import { IoMdSearch } from "react-icons/io";
import { FileSpreadsheet } from "lucide-react";

const cx = classNames.bind(styles);

export default function UserAction({
  isOpen,
  setIsOpen,
  isCreate,
  setIsCreate,
  onExportExcel,
}) {
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
        onClick={() => setIsCreate(!isCreate)}
      >
        Thêm mới TK
      </button>
      <button className={cx("exportBtn")} onClick={onExportExcel}>
        <FileSpreadsheet size={16} />
        Xuất Excel
      </button>
    </div>
  );
}
