public class OrderDto
{
    public long Id { get; set; }
    public DateTime UpdateAt { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemDto> Items { get; set; }
}