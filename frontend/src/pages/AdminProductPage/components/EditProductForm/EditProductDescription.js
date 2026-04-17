import styles from "./EditProductDescription.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function EditProductDescription({ data, onChange }) {
  return (
    <div className={cx("formGroup")}>
      <p>Mô tả sản phẩm:</p>
      <textarea
        placeholder="Nhập mô tả sản phẩm..."
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
}
