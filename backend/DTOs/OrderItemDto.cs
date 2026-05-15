public class OrderItemDto
{
    public long ProductId { get; set; }
    public string Slug { get; set; }
    public string ProductName { get; set; }
    public string Thumbnail { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public bool IsReview { get; set; }
}