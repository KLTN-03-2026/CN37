public class OrderItem
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public long ProductId { get; set; }

    public decimal? Price { get; set; }
    public int Quantity { get; set; }
    public bool IsReview { get; set; } = false;
    public decimal CostPrice { get; set; }
    public Order Order { get; set; }
    public Product Product { get; set; }
}