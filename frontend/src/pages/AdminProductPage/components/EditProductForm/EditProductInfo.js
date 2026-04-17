import styles from "./EditProductInfo.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function EditProductInfo({ data, onChange }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("formGroup")}>
        <p>Tên sản phẩm:</p>
        <input
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className={cx("grid")}>
        <div className={cx("formGroup")}>
          <p>Giá tiền gốc:</p>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </div>

        <div className={cx("formGroup")}>
          <p>Giá tiền sau giảm giá:</p>
          <input
            type="number"
            value={data.discountPrice}
            onChange={(e) => onChange("discountPrice", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}