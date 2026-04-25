public interface IOrderService
{
    //User
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    Task<List<OrderDto>> GetOrdersAsync(long userId, OrderQueryRequest query);
    Task CancelOrderAsync(long userId, long orderId);
    Task UpdateAddressAsync(long userId, long orderId, long newAddressId);

    //Admin
    Task<List<OrderDto>> GetAllOrdersAsync(AdminOrderQueryRequest query);
    Task<OrderDetailDto> GetOrderDetailAsync(long orderId);
    Task UpdateOrderStatusAsync(long orderId, string status);
}