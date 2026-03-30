import styles from "./ConfirmDialog.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ConfirmDialog({
  open,
  title = "Xác nhận",
  message = "Bạn có chắc muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("dialog")}>
        <h3>{title}</h3>

        <p>{message}</p>

        <div className={cx("actions")}>
          <button className={cx("cancel")} onClick={onCancel}>
            {cancelText}
          </button>

          <button className={cx("confirm")} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;