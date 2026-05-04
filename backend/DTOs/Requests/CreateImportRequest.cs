public class CreateImportRequest
{
    public long? SupplierId { get; set; }
    public string? Note { get; set; }

    public List<ImportItemDto> Items { get; set; } = new();
}
