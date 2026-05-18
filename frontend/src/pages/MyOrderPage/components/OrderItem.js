import classNames from "classnames/bind";
import styles from "./OrderItem.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

export default function OrderItem({
  order,
  onCancel,
  onEditAddress,
  onReview,
  onPayAgain,
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ xác nhận":
      case "Chờ thanh toán":
        return "pending";
      case "Chờ lấy hàng":
        return "processing";
      case "Đang giao":
        return "shipping";
      case "Hoàn tất":
        return "completed";
      case "Đã hủy":
        return "cancelled";
      default:
        return "";
    }
  };

  const [timeLeft, setTimeLeft] = useState("");

  const isPayOSPending =
    order.paymentMethod === "PAYOS" &&
    order.paymentStatus === "Chờ thanh toán" &&
    order.status !== "Đã hủy";

  const isPaidPayOS =
    order.paymentMethod === "PAYOS" && order.paymentStatus === "Đã thanh toán";

  const canCancel =
    order.status === "Chờ xác nhận" || order.status === "Chờ thanh toán";

  useEffect(() => {
    if (!isPayOSPending || !order.expiredAt) return;

    const updateCountdown = () => {
      const expiredTime = new Date(order.expiredAt).getTime();
      const now = Date.now();
      const diff = expiredTime - now;

      if (diff <= 0) {
        setTimeLeft("Đã hết hạn");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours} : ${minutes} : ${seconds} `);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [isPayOSPending, order.expiredAt]);

  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <span>
          {new Date(order.updateAt).toLocaleDateString()} •{" "}
          {order.items?.length} sản phẩm
        </span>

        <span className={cx("status", getStatusClass(order.status))}>
          <span className={cx("dot")}></span>
          {order.status}
        </span>
      </div>

      {isPayOSPending && (
        <div className={cx("paymentNotice")}>
          Đơn hàng đang chờ thanh toán online. Bạn có thể thanh toán lại trong
          vòng 24 giờ kể từ lúc tạo đơn.
        </div>
      )}

      {isPaidPayOS && canCancel && (
        <div className={cx("refundNotice")}>
          Đơn hàng đã thanh toán. Nếu hủy đơn, bạn cần chọn tài khoản ngân hàng
          để nhận hoàn tiền.
        </div>
      )}

      <div className={cx("data")}>
        {order.items?.map((item) => (
          <div key={item.productId} className={cx("item")}>
            <img src={item.thumbnail} alt={item.productName} />

            <div className={cx("info")}>
              <h4>{item.productName}</h4>
              <p>Số lượng: {item.quantity}</p>
            </div>

            <div className={cx("price_review")}>
              <div className={cx("price")}>{item.price.toLocaleString()}đ</div>

              {order.status === "Hoàn tất" && !item.isReview && (
                <div className={cx("action")}>
                  <button
                    className={cx("btn", "btnContact")}
                    onClick={() => onReview(item.productId, order.id)}
                  >
                    Đánh giá đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={cx("footer")}>
        <div className={cx("action")}>
          {isPayOSPending && (
            <button
              className={cx("btn", "btnPay")}
              onClick={() => onPayAgain(order.id)}
              disabled={timeLeft === "Đã hết hạn"}
            >
              {timeLeft === "Đã hết hạn"
                ? "Đã hết hạn thanh toán"
                : `Thanh toán ${timeLeft}`}
            </button>
          )}

          {canCancel && (
            <>
              <button
                className={cx("btn", "btnCancel")}
                onClick={() =>
                  onCancel(order.id, {
                    needRefund: isPaidPayOS,
                    order,
                  })
                }
              >
                {isPaidPayOS ? "Yêu cầu hủy & hoàn tiền" : "Hủy đơn hàng"}
              </button>

              {/* <button
                className={cx("btn", "btnContact")}
                onClick={() => onEditAddress(order.id)}
              >
                Liên hệ shop
              </button> */}
            </>
          )}
        </div>

        <span>
          Thành tiền: <b>{order.totalAmount.toLocaleString()}đ</b>
        </span>
      </div>
    </div>
  );
}
