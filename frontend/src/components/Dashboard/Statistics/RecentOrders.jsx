import React from "react";
import classNames from "classnames/bind";
import styles from "./RecentOrders.module.scss";

const cx = classNames.bind(styles);

const RecentOrders = ({ orders = [], isLoading = false }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";

    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProductNames = (items = []) => {
    if (!items.length) return "Không có sản phẩm";

    return items.map((item) => item.productName).join(", ");
  };

  const getPaymentStatus = (status) => {
    switch (status) {
      case "Chờ thanh toán":
        return "completed";
      case "Đã thanh toán":
        return "processing";
      case "Chờ hoàn tiền":
        return "shipping";
      case "Đã hoàn tiền":
        return "cancelled";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "pending";
      case "Đang xử lý":
      case "Đang chuẩn bị":
        return "processing";
      case "Đang giao":
        return "shipping";
      case "Đã giao":
      case "Hoàn tất":
        return "completed";
      case "Đã hủy":
        return "cancelled";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className={cx("card")}>
        <div className={cx("cardHeader")}>
          <div className={cx("skeleton", "titleSkeleton")}></div>
        </div>

        <div className={cx("cardBody")}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={cx("skeleton", "rowSkeleton")}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <div>
          <h2 className={cx("title")}>Đơn hàng gần đây</h2>
          <p className={cx("subtitle")}>Danh sách các đơn hàng mới nhất</p>
        </div>
        <button
          className={cx("viewAllBtn")}
          onClick={() => (window.location.href = "/admin/orders")}
        >
          Xem tất cả
        </button>
      </div>

      <div className={cx("cardBody")}>
        <div className={cx("tableWrapper")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th className={cx("hideMd")}>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>thanh toán</th>
                <th className={cx("hideLg")}>Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className={cx("orderId")}>#{order.id}</td>

                    <td>
                      <div className={cx("customer")}>
                        <span className={cx("customerName")}>
                          {order.customerName}
                        </span>
                        <span className={cx("phone")}>{order.phone}</span>
                      </div>
                    </td>

                    <td className={cx("productCell", "hideMd")}>
                      {getProductNames(order.items)}
                    </td>

                    <td className={cx("amount")}>
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td>
                      <span
                        className={cx("badge", getStatusClass(order.status))}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={cx(
                          "badge",
                          getPaymentStatus(order.paymentStatus),
                        )}
                      >
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </td>

                    <td className={cx("time", "hideLg")}>
                      {formatDate(order.updateAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={cx("empty")}>
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
