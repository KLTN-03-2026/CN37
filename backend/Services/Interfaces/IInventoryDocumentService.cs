public interface IInventoryDocumentService
{
    Task<long> CreateImportAsync(CreateImportRequest request, long userId);
    Task<long> CreateExportAsync(CreateExportRequest request, long userId);
}