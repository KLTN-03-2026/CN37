import classNames from "classnames/bind";
import styles from "./PaymentMethod.module.scss";

const cx = classNames.bind(styles);

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <div className={cx("card")}>
      <div className={cx("cardTitle")}>Phương thức thanh toán</div>

      <div className={cx("paymentList")}>

        {/* COD */}
        <div
          className={cx("paymentItem", {
            active: paymentMethod === "COD"
          })}
          onClick={() => setPaymentMethod("COD")}
        >
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            readOnly
          />

          <div className={cx("paymentInfo")}>
            <div className={cx("paymentTitle")}>
              Thanh toán khi nhận hàng (COD)
            </div>
            <div className={cx("paymentDesc")}>
              Thanh toán bằng tiền mặt khi nhận hàng
            </div>
          </div>
        </div>

        {/* BANK */}
        <div
          className={cx("paymentItem", {
            active: paymentMethod === "BANK"
          })}
          onClick={() => setPaymentMethod("BANK")}
        >
          <input
            type="radio"
            checked={paymentMethod === "BANK"}
            readOnly
          />

          <div className={cx("paymentInfo")}>
            <div className={cx("paymentTitle")}>
              Chuyển khoản ngân hàng
            </div>
            <div className={cx("paymentDesc")}>
              Thanh toán qua tài khoản ngân hàng
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}