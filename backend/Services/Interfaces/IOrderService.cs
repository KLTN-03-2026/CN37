public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
}