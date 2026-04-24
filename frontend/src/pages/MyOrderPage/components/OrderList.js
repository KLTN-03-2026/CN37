import OrderItem from "./OrderItem";

export default function OrderList({ orders, refresh }) {
  return (
    <div>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} refresh={refresh} />
      ))}
    </div>
  );
}