public class ProductCreateRequest
{
    public string Name { get; set; }
    public long CategoryId { get; set; }
    public string Brand { get; set; }
    public string Description { get; set; }

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    public string Thumbnail { get; set; }
}