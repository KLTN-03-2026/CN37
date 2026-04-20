public class ProductFilterRequest
{
    public string? Search { get; set; }
    public long? ParentCategoryId { get; set; }
    public long? CategoryId { get; set; }
    public string? Status { get; set; }
}