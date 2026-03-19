public class Category
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string? Description { get; set; }    
    public long? ParentId { get; set; }
    public DateTime CreateAt { get; set; }
    public Category Parent { get; set; }
    public List<Category> Children { get; set; } = new List<Category>();
}