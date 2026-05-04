public class CreateExportRequest
{
    public string ExportType { get; set; } = "MANUAL"; // SALE / MANUAL
    public long? ReferenceId { get; set; }
    public string? Note { get; set; }

    public List<ExportItemDto> Items { get; set; } = new();
}