import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminOrderPage.module.scss";
import { getOrders, cancelOrder, getAdminOrders } from "../../api/OrderApi";
import ConfirmDialog from "../../components/ConfirmDialog";
import { notifyError, notifySuccess } from "../../components/Nofitication";

import OrderTabs from "../MyOrderPage/components/OrderTabs";
import OrderSearch from "../MyOrderPage/components/OrderSearch";
import OrderList from "./components/OrderList";
import EmptyState from "../MyOrderPage/components/EmptyState";

const cx = classNames.bind(styles);

export default function MyOrderPage() {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchOrders = async () => {
    const res = await getAdminOrders({ status, keyword });
    setOrders(res.data);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await cancelOrder(orderId);
      fetchOrders();
      notifySuccess("Hủy đơn hàng thành công");
    } catch (error) {
      const message = error.response?.data?.message || "Hủy đơn hàng thất bại";
      notifyError(message);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleEditAddress = (orderId) => {
    console.log(orderId);
  };

  const handleAskCancel = (orderId) => {
    setDeleteId(orderId);
    setShowConfirm(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [status, keyword]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("topBar")}>
        <h2 className={cx("title")}>Đơn hàng của tôi</h2>
        <OrderSearch onSearch={setKeyword} />
      </div>

      <div className={cx("content")}>
        <OrderTabs onChange={setStatus} />

        <div className={cx("list")}>
          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <OrderList
              orders={orders}
              onCancel={handleAskCancel}
              onEditAddress={handleEditAddress}
              refresh={fetchOrders}
            />
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Hủy đơn hàng"
        message="Bạn có chắc muốn hủy đơn hàng này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={() => handleCancelOrder(deleteId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
