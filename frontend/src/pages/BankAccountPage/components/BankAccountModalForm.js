import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./BankAccountModalForm.module.scss";
import { getVietnamBanks } from "../../../api/BankAccountApi";

const cx = classNames.bind(styles);

function BankAccountModalForm({ isOpen, onClose, onSubmit }) {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const [form, setForm] = useState({
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isOpen) return;

    getVietnamBanks().then((res) => {
      setBanks(res.data?.data || []);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        bankName: "",
        bankAccountNumber: "",
        bankAccountName: "",
        isDefault: false,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "bankName") {
      const bank = banks.find((x) => x.shortName === value);
      setSelectedBank(bank || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      bankLogo: selectedBank?.logo,
    });
  };

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <div className={cx("modalHeader")}>
          <h3>Thêm tài khoản ngân hàng</h3>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={cx("form")}>
          <div className={cx("formGroup")}>
            <label>Ngân hàng</label>
            <select
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            >
              <option value="">-- Chọn ngân hàng --</option>

              {banks.map((bank) => (
                <option key={bank.id} value={bank.shortName}>
                  {bank.shortName} - {bank.name}
                </option>
              ))}
            </select>
            {selectedBank && (
              <div className={cx("bankPreview")}>
                <img src={selectedBank.logo} alt={selectedBank.shortName} />

                <div>
                  <h4>{selectedBank.shortName}</h4>
                  <p>{selectedBank.name}</p>
                </div>
              </div>
            )}
          </div>

          <div className={cx("formGroup")}>
            <label>Số tài khoản</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              onChange={handleChange}
              placeholder="Nhập số tài khoản"
            />
          </div>

          <div className={cx("formGroup")}>
            <label>Tên chủ tài khoản</label>
            <input
              type="text"
              name="bankAccountName"
              value={form.bankAccountName}
              onChange={handleChange}
              placeholder="VD: NGUYEN VAN A"
            />
          </div>

          <label className={cx("checkbox")}>
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            <span>Đặt làm tài khoản mặc định</span>
          </label>

          <div className={cx("actions")}>
            <button type="button" className={cx("cancelBtn")} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={cx("submitBtn")}>
              Lưu tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankAccountModalForm;
