import classNames from "classnames/bind";
import styles from "./UserSearch.module.scss";
import { useState, useEffect } from "react";

const cx = classNames.bind(styles);

const emptyForm = {
  email: "",
  fullName: "",
  isActive: "",
  roleName: "",
  dateFrom: "",
  dateTo: "",
};

export default function UserSearch({ onSearch, isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // disable scroll background
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const validateField = (key, value, currentForm) => {
    let error = "";
    const newForm = { ...currentForm, [key]: value };

    switch (key) {
      case "email":
        if (value && !/^\S+@\S+\.\S+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "dateFrom":
      case "dateTo":
        if (newForm.dateFrom && newForm.dateTo) {
          if (new Date(newForm.dateFrom) > new Date(newForm.dateTo)) {
            error = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
          }
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [key]: error,
    }));

    return error;
  };

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      validateField(key, value, prev);
      return updated;
    });
  };

  const validateAll = () => {
    let valid = true;

    Object.entries(form).forEach(([key, value]) => {
      const err = validateField(key, value, form);
      if (err) valid = false;
    });

    return valid;
  };

  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    onSearch(emptyForm);
  };

  const handleSubmit = () => {
    if (!validateAll()) return;

    const payload = {
      Email: form.email || null,
      FullName: form.fullName || null,
      IsActive:
        form.isActive === ""
          ? null
          : form.isActive === "true",
      RoleName: form.roleName || null,
      CreatedFrom: form.dateFrom || null,
      CreatedTo: form.dateTo || null,
      Page: 1,
      PageSize: 20,
    };

    onSearch(payload);
    onClose(); // đóng modal

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isOpen) return null;

  return (
    <div
      className={cx("modalOverlay", { open: isOpen })}
      onClick={onClose}
    >
      <div
        className={cx("modalBox")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={cx("header")}>
          <h3>Bộ lọc người dùng</h3>
          <button className={cx("closeBtn")} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={cx("wrapper")}>
          <div className={cx("grid")}>
            {/* Email */}
            <div className={cx("field")}>
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Nhập email"
                className={cx({ errorInput: errors.email })}
              />
              {errors.email && (
                <span className={cx("errorText")}>{errors.email}</span>
              )}
            </div>

            {/* Full name */}
            <div className={cx("field")}>
              <label>Tên người dùng</label>
              <input
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nhập tên"
              />
            </div>

            {/* Status */}
            <div className={cx("field")}>
              <label>Trạng thái</label>
              <select
                className={cx("select")}
                value={form.isActive}
                onChange={(e) => handleChange("isActive", e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="true">Hoạt động</option>
                <option value="false">Bị khóa</option>
              </select>
            </div>

            {/* Role */}
            <div className={cx("field")}>
              <label>Role</label>
              <input
                value={form.roleName}
                onChange={(e) => handleChange("roleName", e.target.value)}
                placeholder="VD: Admin"
              />
            </div>

            {/* Date */}
            <div className={cx("field")}>
              <label>Ngày tạo</label>
              <div className={cx("dateRange")}>
                <input
                  type="date"
                  value={form.dateFrom}
                  onChange={(e) => handleChange("dateFrom", e.target.value)}
                  className={cx({ errorInput: errors.dateFrom })}
                />
                <span>-</span>
                <input
                  type="date"
                  value={form.dateTo}
                  onChange={(e) => handleChange("dateTo", e.target.value)}
                  className={cx({ errorInput: errors.dateTo })}
                />
              </div>
              {(errors.dateFrom || errors.dateTo) && (
                <span className={cx("errorText")}>
                  {errors.dateFrom || errors.dateTo}
                </span>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className={cx("actions")}>
            <button className={cx("btn", "reset")} onClick={handleReset}>
              Đặt lại
            </button>

            <button
              className={cx("btn", "search")}
              onClick={handleSubmit}
              disabled={Object.values(errors).some(Boolean)}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}