import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../AdminProductPage.module.scss";

const cx = classNames.bind(styles);

function ProductModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  return (
    <div className={cx("modal")}>
      <div className={cx("modalContent")}>
        <h3>{product ? "Sửa" : "Thêm"} sản phẩm</h3>

        <input
          className={cx("input")}
          placeholder="Tên"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className={cx("input")}
          placeholder="Giá"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <div className={cx("actions")}>
          <button
            className={cx("btn")}
            onClick={() => onSubmit(form)}
          >
            Lưu
          </button>

          <button
            className={cx("btnCancel")}
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;