public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
    Task AddOrderItemsAsync(List<OrderItem> items);
    Task AddPaymentAsync(Payment payment);
}