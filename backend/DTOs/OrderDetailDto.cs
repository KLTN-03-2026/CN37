public class OrderDetailDto
{
    public long Id { get; set; }
    public string CustomerName { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }

    public List<OrderItemDto> Items { get; set; }
}