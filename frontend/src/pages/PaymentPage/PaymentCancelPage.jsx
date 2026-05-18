import { Link } from "react-router-dom";
import styles from "./PaymentResult.module.scss";

export default function PaymentCancelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconCancel}>!</div>

        <h2 className={styles.title}>Thanh toán đã bị hủy</h2>

        <p className={styles.desc}>
          Giao dịch chưa được hoàn tất. Bạn có thể quay lại giỏ hàng hoặc tiếp tục mua sắm.
        </p>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.btnPrimary}>
            Quay lại giỏ hàng
          </Link>

          <Link to="/" className={styles.btnSecondary}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}