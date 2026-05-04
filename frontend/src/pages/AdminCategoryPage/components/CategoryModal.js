import { useEffect, useState } from "react";
import styles from "./CategoryModal.module.scss";
import classNames from "classnames/bind";
import { notifyError, notifyWarning } from "../../../components/Nofitication";

const cx = classNames.bind(styles);

function CategoryModal({ open, onClose, onSubmit, editing, parentId }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // ===== FILL DATA KHI EDIT =====
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        description: editing.description || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
      });
    }
  }, [editing]);

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
    });
    onClose();
  };

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== SUBMIT =====
  const handleSubmit = () => {
    if (!form.name) {
      notifyError("Tên danh mục không được để trống");
      return;
    }

    const data = {
      ...form,
      parentId: editing ? editing.parentId : parentId || null,
    };

    onSubmit(data);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <h2>{editing ? "Cập nhật danh mục" : "Thêm danh mục"}</h2>

        <div className={cx("formGroup")}>
          <label>Tên danh mục</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className={cx("formGroup")}>
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className={cx("actions")}>
          <button className={cx("cancel")} onClick={handleClose}>
            Hủy
          </button>

          <button className={cx("submit")} onClick={handleSubmit}>
            {editing ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
