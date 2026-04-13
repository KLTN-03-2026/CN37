public class CreateCategoryRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public long? ParentId { get; set; }
}