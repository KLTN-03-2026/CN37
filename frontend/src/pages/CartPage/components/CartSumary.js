import styles from "../Cart.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function CartSummary({ items }) {
  const total = items.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity),
    0
  );

  const discount = items.reduce(
    (sum, item) =>
      sum +
      ((item.price - (item.discountPrice || item.price)) * item.quantity),
    0
  );

  const finalTotal = total - discount;

  return (
    <div className={cx("summary")}>
      <h3>Thông tin đơn hàng</h3>

      <div className={cx("row")}>
        <span>Tổng tiền</span>
        <span>{total.toLocaleString()}đ</span>
      </div>

      <div className={cx("row", "discount")}>
        <span>Tổng khuyến mãi</span>
        <span>-{discount.toLocaleString()}đ</span>
      </div>

      <div className={cx("divider")} />

      <div className={cx("row", "final")}>
        <span>Cần thanh toán</span>
        <span>{finalTotal.toLocaleString()}đ</span>
      </div>

      <div className={cx("reward")}>
        <span>Điểm thưởng</span>
        <span>🪙 +{Math.floor(finalTotal / 4000)}</span>
      </div>

      <button className={cx("checkout")} disabled={items.length === 0}>
        Xác nhận đơn
      </button>
    </div>
  );
}

export default CartSummary;