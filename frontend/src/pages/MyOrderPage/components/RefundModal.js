import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./RefundModal.module.scss";

const cx = classNames.bind(styles);

export default function RefundModal({
  open,
  onClose,
  onSubmit,
  bankAccounts = [],
}) {
  const [selectedBankId, setSelectedBankId] = useState("");
  const [reason, setReason] = useState("");
  const [showBankPicker, setShowBankPicker] = useState(false);

  useEffect(() => {
    if (open) {
      const defaultBank =
        bankAccounts.find((x) => x.isDefault) || bankAccounts[0] || null;

      setSelectedBankId(defaultBank?.id || "");
      setReason("");
      setShowBankPicker(false);
    }
  }, [open, bankAccounts]);

  if (!open) return null;

  const selectedBank =
    bankAccounts.find((x) => x.id === Number(selectedBankId)) ||
    bankAccounts.find((x) => x.isDefault) ||
    bankAccounts[0] ||
    null;

  const handleSubmit = () => {
    if (!selectedBank) {
      alert("Vui lòng chọn tài khoản ngân hàng");
      return;
    }

    onSubmit({
      bankAccountId: selectedBank.id,
      reason,
    });
  };

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <div className={cx("header")}>
          <h3>Yêu cầu hủy đơn & hoàn tiền</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className={cx("body")}>
          <p className={cx("desc")}>
            Tiền sẽ được hoàn về tài khoản ngân hàng bạn chọn bên dưới.
          </p>

          {selectedBank ? (
            <div className={cx("selectedBank")}>
              <img
                src={selectedBank.bankLogo}
                alt={selectedBank.bankName}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className={cx("bankInfo")}>
                <h4>{selectedBank.bankName}</h4>
                <p>
                  Số tài khoản: <b>{selectedBank.bankAccountNumber}</b>
                </p>
                <p>
                  Chủ tài khoản: <b>{selectedBank.bankAccountName}</b>
                </p>
              </div>

              <button
                className={cx("changeBtn")}
                onClick={() => setShowBankPicker((prev) => !prev)}
              >
                Thay đổi
              </button>
            </div>
          ) : (
            <div className={cx("emptyBank")}>
              Bạn chưa có tài khoản ngân hàng nào.
            </div>
          )}

          {showBankPicker && (
            <div className={cx("pickerOverlay")}>
              <div className={cx("pickerModal")}>
                <div className={cx("pickerHeader")}>
                  <h3>Chọn tài khoản ngân hàng</h3>
                  <button onClick={() => setShowBankPicker(false)}>×</button>
                </div>

                <div className={cx("pickerBody")}>
                  {bankAccounts.map((bank) => (
                    <div
                      key={bank.id}
                      className={cx("bankItem", {
                        active: bank.id === selectedBank?.id,
                      })}
                      onClick={() => {
                        setSelectedBankId(bank.id);
                        setShowBankPicker(false);
                      }}
                    >
                      <img
                        src={bank.bankLogo}
                        alt={bank.bankName}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <div>
                        <h4>{bank.bankName}</h4>
                        <p>Số tài khoản: {bank.bankAccountNumber}</p>
                        <p>Chủ tài khoản: {bank.bankAccountName}</p>
                      </div>

                      {bank.id === selectedBank?.id && (
                        <span className={cx("checked")}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className={cx("formGroup")}>
            <label>Lý do hủy đơn</label>
            <textarea
              placeholder="Nhập lý do hủy đơn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className={cx("actions")}>
            <button className={cx("cancelBtn")} onClick={onClose}>
              Đóng
            </button>

            <button className={cx("submitBtn")} onClick={handleSubmit}>
              Gửi yêu cầu hoàn tiền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
