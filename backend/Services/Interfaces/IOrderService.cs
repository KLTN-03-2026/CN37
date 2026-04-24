public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    Task<List<OrderDto>> GetOrdersAsync(long userId, OrderQueryRequest query);
    Task CancelOrderAsync(long userId, long orderId);
    Task UpdateAddressAsync(long userId, long orderId, long newAddressId);
}