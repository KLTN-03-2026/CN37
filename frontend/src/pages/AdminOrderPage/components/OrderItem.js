import classNames from "classnames/bind";
import styles from "./OrderItem.module.scss";

const cx = classNames.bind(styles);

export default function OrderItem({
  order,
  onCancel,
  onEditStatus,
  onOpenRefund,
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "pending";
      case "Chờ lấy hàng":
        return "processing";
      case "Đang giao":
        return "shipping";
      case "Hoàn tất":
        return "completed";
      case "Chờ hoàn tiền":
        return "refund";
      case "Đã hủy":
        return "cancelled";
      default:
        return "";
    }
  };

  const isUnpaidPayOS =
    order.paymentMethod === "PAYOS" && order.paymentStatus !== "Đã thanh toán";
  const isRefundPending = order.status === "Chờ hoàn tiền";

  const renderActions = () => {
    switch (order.status) {
      case "Chờ xác nhận":
      case "Chờ thanh toán":
        return (
          <div className={cx("action")}>
            <button
              className={cx("btn", "btnCancel")}
              onClick={() => onCancel(order.id)}
            >
              Hủy đơn hàng
            </button>

            {isUnpaidPayOS ? (
              <button className={cx("btn", "btnDisabled")} disabled>
                Chưa thanh toán
              </button>
            ) : (
              <button
                className={cx("btn", "btnContact")}
                onClick={() => onEditStatus(order.id, "Chờ lấy hàng")}
              >
                Xác nhận đơn
              </button>
            )}
          </div>
        );
      case "Chờ hoàn tiền":
        return (
          <div className={cx("action")}>
            <button
              className={cx("btn", "btnRefund")}
              onClick={() => onOpenRefund(order)}
            >
              Xử lý hoàn tiền
            </button>
          </div>
        );

      case "Chờ lấy hàng":
        return (
          <div className={cx("action")}>
            <button
              className={cx("btn", "btnCancel")}
              onClick={() => onCancel(order.id)}
            >
              Hủy đơn
            </button>

            <button
              className={cx("btn", "btnContact")}
              onClick={() => onEditStatus(order.id, "Đang giao")}
            >
              Gửi hàng
            </button>
          </div>
        );

      case "Đang giao":
        return (
          <button
            className={cx("btn", "btnContact")}
            onClick={() => onEditStatus(order.id, "Hoàn tất")}
          >
            Hoàn tất
          </button>
        );

      default:
        return <span></span>;
    }
  };

  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <span>
          {new Date(order.updateAt).toLocaleDateString()} • MĐH: {order.id} -
          SL: {order.items?.length} sản phẩm
        </span>
        <span className={cx("status", getStatusClass(order.status))}>
          <span className={cx("dot")}></span>
          {order.status}
        </span>
      </div>

      {order.status === "Chờ hoàn tiền" && (
        <div className={cx("refundWarning")}>
          Khách hàng đang yêu cầu hoàn tiền cho đơn hàng này
        </div>
      )}

      <div className={cx("order-info")}>
        <div className={cx("customer-info")}>
          <span>
            {order.customerName} - {order.phone}
          </span>
          <span className={cx("status", getStatusClass(order.status))}>
            {order.address}
          </span>
        </div>
        <div className={cx("order-detail")}>
          <div className={cx("paymentInfo")}>
            <span>
              Thanh toán:{" "}
              <b className={cx(isUnpaidPayOS ? "unpaid" : "paid")}>
                {order.paymentMethod} - {order.paymentStatus}
              </b>
            </span>
          </div>
          <span>Xem chi tiết</span>
        </div>
      </div>

      <div className={cx("data")}>
        {order.items?.map((item) => (
          <div key={item.productId} className={cx("item")}>
            <div className={cx("info")}>
              <h4>{item.productName}</h4>
              <p>x{item.quantity}</p>
            </div>

            <div className={cx("price")}>{item.price.toLocaleString()}đ</div>
          </div>
        ))}
      </div>

      <div className={cx("footer")}>
        {renderActions()}

        <span>
          Thành tiền: <b>{(order.totalAmount || 0).toLocaleString()}đ</b>
        </span>
      </div>
    </div>
  );
}
