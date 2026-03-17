import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { FaSearch } from "react-icons/fa";

const cx = classNames.bind(styles);

function SearchBar() {
  return (
    <div className={cx("searchWrapper")}>
      <div className={cx("searchBox")}>
        <input
          type="text"
          placeholder="Nhập tên điện thoại, laptop, phụ kiện..."
        />

        <button>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
