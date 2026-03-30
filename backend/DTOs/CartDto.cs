public class CartDto
{
    public long CartId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();

    public decimal TotalPrice => Items.Sum(x => x.FinalPrice);
}