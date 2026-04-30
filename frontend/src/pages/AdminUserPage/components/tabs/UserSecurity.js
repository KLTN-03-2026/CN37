import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserSecurity.module.scss";
import ConfirmDialog from "../../../../components/ConfirmDialog";

const cx = classNames.bind(styles);

export default function UserSecurity({ user, onResetPassword }) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await onResetPassword(user.id);
      setToken(res);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("card")}>
      {/* EMAIL VERIFIED */}
      <div className={cx("section")}>
        <h4>Trạng thái email</h4>

        <span
          className={cx("status", {
            verified: user.emailVerified,
            unverified: !user.emailVerified,
          })}
        >
          {user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
        </span>
      </div>

      {/* RESET PASSWORD */}
      <div className={cx("section")}>
        <h4>Bảo mật tài khoản</h4>

        <button
          className={cx("btnDanger")}
          onClick={() => setShowConfirm(true)}
        >
          🔑 Reset mật khẩu
        </button>
      </div>

      {/* TOKEN RESULT */}
      {token && (
        <div className={cx("tokenBox")}>
          <p>Token reset:</p>

          <div className={cx("tokenRow")}>
            <code>{token}</code>

            <button onClick={() => navigator.clipboard.writeText(token)}>
              Copy
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Đổi mật khẩu"
        message={`Bạn có chắc muốn đổi mật khẩu tài khoản này?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={() => {}}
        onCancel={() => {
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
