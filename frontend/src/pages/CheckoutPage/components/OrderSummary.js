import classNames from "classnames/bind";
import styles from "./OrderSumary.module.scss";

const cx = classNames.bind(styles);

export default function OrderSummary({ items, onSubmit }) {
  const shipping = "miễn phí";

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = items.reduce(
    (sum, item) =>
      sum + (item.price - (item.discountPrice || item.price)) * item.quantity,
    0,
  );
  const finalTotal = total - discount;

  return (
    <div className={cx("summary")}>
      <div className={cx("cardTitle")}>Thông tin đơn hàng</div>

      <div className={cx("summaryContent")}>
        <div className={cx("summaryRow")}>
          <span>Tổng tiền</span>
          <span>
            {items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}
            đ
          </span>
        </div>

        <div className={cx("divider")} />

        <div className={cx("summaryRow")}>
          <span className={cx("label")}>Tổng khuyến mãi</span>
          <span className={cx("discountValue")}>
            -{discount.toLocaleString()}đ
          </span>
        </div>

        <div className={cx("discountDetail")}>
          <div className={cx("discountItem")}>
            <span>Giảm giá sản phẩm</span>
            <span>-{discount.toLocaleString()}đ</span>
          </div>

          <div className={cx("discountItem")}>
            <span>Voucher</span>
            <span>0đ</span>
          </div>
        </div>

        <div className={cx("summaryRow")}>
          <span>Phí vận chuyển</span>
          <span>{shipping.toLocaleString()}</span>
        </div>

        <div className={cx("divider-dashed")} />

        <div className={cx("summaryTotal")}>
          <span>Tổng cộng</span>
          <span className={cx("totalPrice")}>
            {finalTotal.toLocaleString()}đ
          </span>
        </div>

        <button className={cx("orderBtn")} onClick={onSubmit}>
          Đặt hàng
        </button>

        <p className={cx("policyText")}>
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý với điều khoản của hệ
          thống
        </p>
      </div>
    </div>
  );
}
