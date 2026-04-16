public class ProductUpdateRequest : ProductCreateRequest
{
    public long Id { get; set; }
    public bool IsActive { get; set; }
}