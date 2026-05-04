import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SupplierPreviewModal.module.scss";

const cx = classNames.bind(styles);

const SupplierPreviewModal = ({
  supplier,
  onClose,
  onEdit,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(supplier);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onEdit(supplier.id, form);
      setIsEditing(false);
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("modal")}>
      <div className={cx("backdrop")} onClick={onClose}></div>
      <div className={cx("content")}>
        <div className={cx("header")}>
          <h2>{isEditing ? "Sửa nhà cung cấp" : "Chi tiết nhà cung cấp"}</h2>
          <button className={cx("closeBtn")} onClick={onClose}>✕</button>
        </div>

        <div className={cx("body")}>
          <div className={cx("formGrid")}>
            <div className={cx("field")}>
              <label>Mã</label>
              <span>{supplier.code}</span>
            </div>

            <div className={cx("field")}>
              <label>Tên nhà cung cấp</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.name}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Người liên hệ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.contactPerson || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.phone || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.email || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.address || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Tỉnh/Thành phố</label>
              {isEditing ? (
                <input
                  type="text"
                  name="province"
                  value={form.province || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.province || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Quận/Huyện</label>
              {isEditing ? (
                <input
                  type="text"
                  name="district"
                  value={form.district || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.district || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Mã số thuế</label>
              {isEditing ? (
                <input
                  type="text"
                  name="taxCode"
                  value={form.taxCode || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.taxCode || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Ngân hàng</label>
              {isEditing ? (
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.bankName || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Số tài khoản</label>
              {isEditing ? (
                <input
                  type="text"
                  name="bankAccount"
                  value={form.bankAccount || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{supplier.bankAccount || "-"}</span>
              )}
            </div>

            <div className={cx("field")}>
              <label>Trạng thái</label>
              <span
                className={cx("status", {
                  active: supplier.status === "ACTIVE",
                  inactive: supplier.status === "INACTIVE",
                })}
              >
                {supplier.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>

            <div className={cx("field", "fullWidth")}>
              <label>Ghi chú</label>
              {isEditing ? (
                <textarea
                  name="note"
                  value={form.note || ""}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              ) : (
                <span>{supplier.note || "-"}</span>
              )}
            </div>
          </div>
        </div>

        <div className={cx("footer")}>
          {!isEditing ? (
            <>
              <button
                className={cx("editBtn")}
                onClick={() => setIsEditing(true)}
              >
                Sửa
              </button>
              <button className={cx("closeMainBtn")} onClick={onClose}>
                Đóng
              </button>
            </>
          ) : (
            <>
              <button
                className={cx("saveBtn")}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                className={cx("cancelBtn")}
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPreviewModal;
