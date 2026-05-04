import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CreateModal.module.scss";
import { FaEye, FaEyeSlash, FaSave } from "react-icons/fa";

const cx = classNames.bind(styles);

export default function CreateModal({ roles = [], onCreate, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    roleIds: [],
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // VALIDATE
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) error = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email không hợp lệ";
        break;

      case "password":
        if (!value) {
          error = "Mật khẩu không được để trống";
        } else if (value.length < 8) {
          error = "Mật khẩu phải ≥ 8 ký tự";
        } else if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Mật khẩu phải có ít nhất 1 chữ hoa và 1 số";
        }
        break;

      case "fullName":
        if (!value.trim()) error = "Họ tên không được để trống";
        break;

      case "phone":
        if (!value.trim()) error = "SĐT không được để trống";
        else if (!/^(0|\+84)[0-9]{9}$/.test(value)) error = "SĐT không hợp lệ";
        break;

      case "roleIds":
        if (value.length === 0) error = "Phải chọn ít nhất 1 role";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue;

    if (name === "roleIds") {
      // checkbox multi role
      if (checked) {
        finalValue = [...formData.roleIds, parseInt(value)];
      } else {
        finalValue = formData.roleIds.filter((id) => id !== parseInt(value));
      }
    } else {
      finalValue = type === "checkbox" ? checked : value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    validateField(name, finalValue);
  };

  // SUBMIT
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    const fields = ["email", "password", "fullName", "phone", "roleIds"];

    let hasError = false;

    fields.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) hasError = true;
    });

    if (hasError) return;

    try {
      setLoading(true);
      await onCreate(formData);
    } finally {;
      setLoading(false);
    }
  };

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("header")}>
          <h3>👤 Thêm Khách hàng</h3>

          <div className={cx("actions")}>
            <button onClick={handleSubmit} disabled={loading}>
              <FaSave />
            </button>
            <button onClick={onClose}>✕</button>
          </div>
        </div>
        <div className={cx("card")}>
          <div className={cx("grid")}>
            {/* EMAIL */}
            <div className={cx("formGroup")}>
              <label>Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cx({ errorInput: errors.email })}
              />
              {errors.email && (
                <span className={cx("errorText")}>{errors.email}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className={cx("formGroup")}>
              <label>Mật khẩu *</label>
              <div className={cx("input_password")}>
                <input
                  type="password"
                  autoComplete="new-password"
                  style={{ display: "none" }}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                ></input>
                <span
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <span className={cx("errorText")}>{errors.password}</span>
              )}
            </div>

            {/* FULLNAME */}
            <div className={cx("formGroup")}>
              <label>Họ tên *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={cx({ errorInput: errors.fullName })}
              />
              {errors.fullName && (
                <span className={cx("errorText")}>{errors.fullName}</span>
              )}
            </div>

            {/* PHONE */}
            <div className={cx("formGroup")}>
              <label>Số điện thoại *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={cx({ errorInput: errors.phone })}
              />
              {errors.phone && (
                <span className={cx("errorText")}>{errors.phone}</span>
              )}
            </div>

            {/* ROLE */}
            <div className={cx("formGroup")}>
              <label>Phân quyền *</label>

              <div className={cx("checkboxGroup")}>
                {roles.map((role) => (
                  <label key={role.id}>
                    <input
                      type="checkbox"
                      name="roleIds"
                      value={role.id}
                      checked={formData.roleIds.includes(role.id)}
                      onChange={handleChange}
                    />
                    {role.name}
                  </label>
                ))}
              </div>

              {errors.roleIds && (
                <span className={cx("errorText")}>{errors.roleIds}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
