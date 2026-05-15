import OrderItem from "./OrderItem";

export default function OrderList({ orders, onCancel, onEditAddress, onReview, refresh }) {
  return (
    <div>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} onCancel={onCancel} onEditAddress={onEditAddress} onReview={onReview} refresh={refresh} />
      ))}
    </div>
  );
}