public class OrderDto
{
    public long Id { get; set; }
    public string CustomerName { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public DateTime? UpdateAt { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public string PaymentMethod { get; set; }
    public string PaymentStatus { get; set; }
    public List<OrderItemDto> Items { get; set; }
}