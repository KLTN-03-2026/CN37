import OrderItem from "./OrderItem";

export default function OrderList({ orders, onCancel, onEditStatus, refresh }) {
  return (
    <div>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} onCancel={onCancel} onEditStatus={onEditStatus} refresh={refresh} />
      ))}
    </div>
  );
}