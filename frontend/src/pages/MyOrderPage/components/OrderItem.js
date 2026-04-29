import classNames from "classnames/bind";
import styles from "./OrderItem.module.scss";

const cx = classNames.bind(styles);

export default function OrderItem({ order, onCancel, onEditAddress, refresh }) {
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
      case "Đã hủy":
        return "cancelled";
      default:
        return "";
    }
  };

  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <span>
          {new Date(order.updateAt).toLocaleDateString()} • {order.items?.length}{" "}
          sản phẩm
        </span>
        <span className={cx("status", getStatusClass(order.status))}>
          <span className={cx("dot")}></span>
          {order.status}
        </span>
      </div>

      <div className={cx("data")}>
        {order.items?.map((item) => (
          <div key={item.productId} className={cx("item")}>
            <img src={item.thumbnail} />
            <div className={cx("info")}>
              <h4>{item.productName}</h4>
              <p>Số lượng: {item.quantity}</p>
            </div>

            <div className={cx("price")}>{item.price.toLocaleString()}đ</div>
          </div>
        ))}
      </div>

      <div className={cx("footer")}>
        {order.status === "Chờ xác nhận" ? (
          <div className={cx("action")}>
            <button className={cx("btn", "btnCancel")} onClick={() => onCancel(order.id)}>
              Hủy đơn hàng
            </button>
            <button className={cx("btn", "btnContact")} onClick={() => onEditAddress(order.id)}>
              Liên hệ shop
            </button>
          </div>
        ) : <span></span>}
        <span>
          Thành tiền: <b>{order.totalAmount.toLocaleString()}đ</b>
        </span>
      </div>
    </div>
  );
}
