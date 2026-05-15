public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
    Task<bool> HasPurchasedProductAsync(long userId, long productId);
    Task AddOrderItemsAsync(List<OrderItem> items);
    Task AddPaymentAsync(Payment payment);
}