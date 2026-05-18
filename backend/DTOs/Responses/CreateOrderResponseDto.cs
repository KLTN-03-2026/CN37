public class CreateOrderResponseDto
{
    public long OrderId { get; set; }
    public string PaymentMethod { get; set; }
    public string PaymentStatus { get; set; }
    public string? CheckoutUrl { get; set; }
}