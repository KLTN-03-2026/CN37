public class CheckoutResponseDto
{
    public List<CartItemDto> Items { get; set; }
    public decimal TotalAmount { get; set; }
}