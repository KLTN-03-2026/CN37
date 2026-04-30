import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditUserInfo.module.scss";

const cx = classNames.bind(styles);

export default function EditUserInfo({ data, onChange }) {
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Họ tên không được để trống";
        } else if (value.trim().length < 2) {
          error = "Họ tên phải ≥ 2 ký tự";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "SĐT không được để trống";
        } else if (!/^(0|\+84)[0-9]{9}$/.test(value)) {
          error = "SĐT không hợp lệ (VD: 0912345678)";
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  const handleLocalChange = (e) => {
    const { name, value, type, checked } = e.target;

    const finalValue = type === "checkbox" ? checked : value;

    validateField(name, finalValue);

    onChange({
      target: {
        name,
        value: finalValue,
      },
    });
  };

  return (
    <div className={cx("card")}>
      <div className={cx("grid")}>

        {/* FULL NAME */}
        <div className={cx("formGroup")}>
          <label>Họ tên</label>
          <input
            name="fullName"
            value={data.fullName || ""}
            onChange={handleLocalChange}
            placeholder="Nhập họ tên..."
            className={cx("input", { errorInput: errors.fullName })}
          />
          {errors.fullName && (
            <span className={cx("errorText")}>{errors.fullName}</span>
          )}
        </div>

        {/* PHONE */}
        <div className={cx("formGroup")}>
          <label>Số điện thoại</label>
          <input
            name="phone"
            value={data.phone || ""}
            onChange={handleLocalChange}
            placeholder="Nhập số điện thoại..."
            className={cx("input", { errorInput: errors.phone })}
          />
          {errors.phone && (
            <span className={cx("errorText")}>{errors.phone}</span>
          )}
        </div>

        {/* STATUS */}
        <div className={cx("formGroup", "full")}>
          <label>Trạng thái</label>

          <label className={cx("switch")}>
            <input
              type="checkbox"
              name="isActive"
              checked={data.isActive}
              onChange={handleLocalChange}
            />
            <span className={cx("slider")}></span>
          </label>

          <span
            className={cx("statusText", {
              active: data.isActive,
              inactive: !data.isActive,
            })}
          >
            {data.isActive ? "Hoạt động" : "Bị khóa"}
          </span>
        </div>

      </div>
    </div>
  );
}