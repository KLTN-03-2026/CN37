public class ProductDto
{
    public long Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string CategoryName { get; set; }
    public bool IsActive { get; set; }
}