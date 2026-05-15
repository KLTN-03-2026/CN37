public class ProductFilterRequest
{
    public string? Search { get; set; }
    public long? ParentCategoryId { get; set; }
    public long? CategoryId { get; set; }
    public string? Status { get; set; }

    // Filter parameters
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Brands { get; set; } // comma-separated
    public string? Sort { get; set; } // price-asc, price-desc, discount
}