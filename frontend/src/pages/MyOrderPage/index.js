import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./MyOrderPage.module.scss";
import { getOrders } from "../../api/OrderApi";

import OrderTabs from "./components/OrderTabs";
import OrderSearch from "./components/OrderSearch";
import OrderList from "./components/OrderList";
import EmptyState from "./components/EmptyState";

const cx = classNames.bind(styles);

export default function MyOrderPage() {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await getOrders({ status, keyword });
    setOrders(res.data);
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
            <OrderList orders={orders} refresh={fetchOrders} />
          )}
        </div>
      </div>
    </div>
  );
}