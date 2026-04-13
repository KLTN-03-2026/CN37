import { FaSearch } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./SearchFilter.module.scss";

const cx = classNames.bind(styles);

function SearchFilter({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm...",
}) {
  return (
    <div className={cx("inputGroup")}>
      <FaSearch className={cx("icon")} />
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
    </div>
  );
}

export default SearchFilter;