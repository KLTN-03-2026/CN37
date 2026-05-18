import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./PaymentResult.module.scss";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderCode = params.get("orderCode");
    const status = params.get("status");

    if (status === "PAID") {
      navigate("/order-success", {
        state: {
          orderCode,
          paymentStatus: "PAID"
        },
        replace: true
      });
    }
  }, [navigate, params]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconSuccess}>✓</div>
        <h2 className={styles.title}>Thanh toán thành công</h2>
        <p className={styles.desc}>Đang chuyển đến trang kết quả đơn hàng...</p>
      </div>
    </div>
  );
}