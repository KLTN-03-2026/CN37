import classNames from "classnames/bind";
import styles from "./OrderSearch.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);

const emptyForm = {
  orderId: "",
  product: "",
  phone: "",
  customer: "",
  shipping: "",
  tracking: "",
  payment: "",
  dateFrom: "",
  dateTo: "",
};

export default function OrderSearch({ onSearch }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ================= VALIDATE =================
  const validateField = (key, value, currentForm) => {
    let error = "";

    const newForm = { ...currentForm, [key]: value };

    switch (key) {
      case "orderId":
        if (value && !/^\d+$/.test(value)) {
          error = "ID phải là số";
        }
        break;

      case "phone":
        if (value && !/^(0|\+84)\d{9}$/.test(value)) {
          error = "SĐT không hợp lệ";
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

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [key]: error,
    }));

    return error;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      validateField(key, value, prev);
      return updated;
    });
  };

  // ================= VALIDATE ALL =================
  const validateAll = () => {
    let valid = true;

    Object.entries(form).forEach(([key, value]) => {
      const err = validateField(key, value, form);
      if (err) valid = false;
    });

    return valid;
  };

  // ================= RESET =================
  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    onSearch(emptyForm);
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!validateAll()) return;
    onSearch(form);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("grid")}>

        {/* ID */}
        <div className={cx("field")}>
          <label>ID đơn hàng</label>
          <input
            value={form.orderId}
            onChange={(e) =>
              handleChange("orderId", e.target.value.replace(/\D/g, ""))
            }
            placeholder="Nhập"
            className={cx({ errorInput: errors.orderId })}
          />
          {errors.orderId && <span className={cx("errorText")}>{errors.orderId}</span>}
        </div>

        {/* Shipping */}
        <div className={cx("field")}>
          <label>Đơn vị vận chuyển</label>
          <select
            value={form.shipping}
            onChange={(e) => handleChange("shipping", e.target.value)}
          >
            <option value="">Chọn</option>
            <option value="GHN">GHN</option>
            <option value="GHTK">GHTK</option>
          </select>
        </div>

        {/* Product */}
        <div className={cx("field")}>
          <label>Tên sản phẩm</label>
          <input
            value={form.product}
            onChange={(e) => handleChange("product", e.target.value)}
            placeholder="Nhập"
          />
        </div>

        {/* Tracking */}
        <div className={cx("field")}>
          <label>Mã vận đơn</label>
          <input
            value={form.tracking}
            onChange={(e) => handleChange("tracking", e.target.value)}
            placeholder="Nhập"
          />
        </div>

        {/* Phone */}
        <div className={cx("field")}>
          <label>Số điện thoại</label>
          <input
            value={form.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value.replace(/\D/g, ""))
            }
            placeholder="Nhập"
            className={cx({ errorInput: errors.phone })}
          />
          {errors.phone && <span className={cx("errorText")}>{errors.phone}</span>}
        </div>

        {/* Date */}
        <div className={cx("field")}>
          <label>Ngày tạo đơn</label>
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

        {/* Customer */}
        <div className={cx("field")}>
          <label>Tên người mua</label>
          <input
            value={form.customer}
            onChange={(e) => handleChange("customer", e.target.value)}
            placeholder="Nhập"
          />
        </div>

        {/* Payment */}
        <div className={cx("field")}>
          <label>Phương thức thanh toán</label>
          <select
            value={form.payment}
            onChange={(e) => handleChange("payment", e.target.value)}
          >
            <option value="">Chọn</option>
            <option value="COD">COD</option>
            <option value="Online">Online</option>
          </select>
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
  );
}