import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./OrderSuccess.module.scss";

const cx = classNames.bind(styles);

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 dữ liệu demo (sau này lấy từ API hoặc state)
  const order = location.state || {
    orderId: "",
    createdAt: "",
    totalPrice: "",
  };

  // 🔒 Chặn back
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (
      order.orderId === "" ||
      order.createdAt === "" ||
      order.totalPrice === ""
    ) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("card")}>
        {/* Icon */}
        <div className={cx("icon")}>
          <span>✔</span>
        </div>

        {/* Title */}
        <h1 className={cx("title")}>Đặt hàng thành công</h1>

        <p className={cx("desc")}>
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý!
        </p>

        <div className={cx("divider")} />

        {/* Info */}
        <div className={cx("info")}>
          <div>
            <p>Mã đơn hàng</p>
            <p>Thời gian</p>
            <p>Giá trị đơn hàng</p>
          </div>

          <div className={cx("value")}>
            <p>{order.orderId}</p>
            <p>{dayjs(order.createdAt).format("HH:mm DD/MM/YYYY")}</p>
            <p>{order.totalPrice?.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        {/* Button */}
        <button className={cx("btn-home")} onClick={handleGoHome}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
