import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

function FilterSidebar() {
  return (
    <div className={cx("filter")}>
      <h3>Bộ lọc</h3>
      <div>
        <p>Hãng</p>
        <label>
          <input type="checkbox" /> Apple
        </label>
        <label>
          <input type="checkbox" /> Samsung
        </label>
      </div>

      <div>
        <p>Giá</p>
        <label>
          <input type="radio" /> Dưới 5 triệu
        </label>
      </div>
    </div>
  );
}

export default FilterSidebar;
