import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./MyOrderPage.module.scss";
import { getOrders, cancelOrder, getCountByStatus } from "../../api/OrderApi";
import ConfirmDialog from "../../components/ConfirmDialog";
import { notifyError, notifySuccess } from "../../components/Nofitication";

import OrderTabs from "./components/OrderTabs";
import OrderSearch from "./components/OrderSearch";
import OrderList from "./components/OrderList";
import EmptyState from "./components/EmptyState";

const cx = classNames.bind(styles);

export default function MyOrderPage() {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [countByStatus, setCountByStatus] = useState({});

  const fetchOrders = async () => {
    const res = await getOrders({ status, keyword });
    setOrders(res.data);
  };

  const fetchCounts = async () => {
    const res = await getCountByStatus();

    const map = {};
    res.data.forEach((item) => {
      map[item.status] = item.count;
    });

    setCountByStatus(map);
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
    fetchCounts();
  }, [status, keyword]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("topBar")}>
        <h2 className={cx("title")}>Đơn hàng của tôi</h2>
        <OrderSearch onSearch={setKeyword} />
      </div>

      <div className={cx("content")}>
        <OrderTabs onChange={setStatus} counts={countByStatus} />

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
