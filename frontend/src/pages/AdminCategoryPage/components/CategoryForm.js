import { useState } from "react";
import styles from "./CategoryForm.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function CategoryForm({ onSubmit, initial, categories }) {
  const [form, setForm] = useState(
    initial || { name: "", description: "", parentId: "" }
  );

  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>
        {initial ? "Cập nhật danh mục" : "Thêm danh mục"}
      </h2>

      <div className={cx("formGroup")}>
        <label>Tên danh mục</label>
        <input
          className={cx("input")}
          placeholder="Nhập tên danh mục..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className={cx("formGroup")}>
        <label>Mô tả</label>
        <textarea
          className={cx("textarea")}
          placeholder="Nhập mô tả..."
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div className={cx("formGroup")}>
        <label>Danh mục cha</label>
        <select
          className={cx("select")}
          value={form.parentId || ""}
          onChange={(e) =>
            setForm({ ...form, parentId: e.target.value || null })
          }
        >
          <option value="">-- Không có --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className={cx("btnSubmit")}
        onClick={() => onSubmit(form)}
      >
        {initial ? "Cập nhật" : "Lưu"}
      </button>
    </div>
  );
}

export default CategoryForm;