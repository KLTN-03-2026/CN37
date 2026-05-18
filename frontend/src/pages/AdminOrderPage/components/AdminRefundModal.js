import classNames from "classnames/bind";
import styles from "./AdminRefundModal.module.scss";

const cx = classNames.bind(styles);

export default function AdminRefundModal({
  open,
  onClose,
  refund,
  onConfirm,
  loading = false,
}) {
  if (!open || !refund) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <div className={cx("header")}>
          <h3>Xử lý hoàn tiền</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className={cx("body")}>
          <div className={cx("amountBox")}>
            <span>Số tiền cần hoàn</span>
            <b>{(refund.amount || 0).toLocaleString()}đ</b>
          </div>

          <div className={cx("bankCard")}>
            {refund.bankLogo && (
              <img
                src={refund.bankLogo}
                alt={refund.bankName}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className={cx("bankInfo")}>
              <h4>{refund.bankName}</h4>

              <p>
                Số tài khoản: <b>{refund.bankAccountNumber}</b>
              </p>

              <p>
                Chủ tài khoản: <b>{refund.bankAccountName}</b>
              </p>
            </div>
          </div>

          {refund.reason && (
            <div className={cx("reason")}>
              <span>Lý do hủy đơn</span>
              <p>{refund.reason}</p>
            </div>
          )}

          <div className={cx("note")}>
            Sau khi chuyển khoản hoàn tiền cho khách, bấm “Đã hoàn tiền” để cập
            nhật trạng thái đơn hàng.
          </div>

          <div className={cx("actions")}>
            <button className={cx("cancelBtn")} onClick={onClose}>
              Đóng
            </button>

            <button
              className={cx("confirmBtn")}
              onClick={() => onConfirm(refund.id)}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đã hoàn tiền"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}