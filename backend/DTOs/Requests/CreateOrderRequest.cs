public class CreateOrderRequest
{
    public long UserId { get; set; }
    public long AddressId { get; set; }

    public string PaymentMethod { get; set; }
    public string Note { get; set; }
    public List<OrderItemRequest> Items { get; set; }
    public string Type { get; set; }
}