public interface ISupplierService
{
    Task<SupplierDto> CreateSupplierAsync(CreateSupplierRequest request, long adminId, string ip);
    Task<SupplierDto> UpdateSupplierAsync(long supplierId, UpdateSupplierRequest request, long adminId, string ip);
    // Task<List<SupplierDto>> GetAllSupplierAsync();
    Task<SupplierDto> GetSupplierAsync(long supplierId);
    Task<PagedResult<SupplierDto>> SearchSuppliersAsync(SupplierSearchParams p);
    Task DeleteSupplierAsync(long supplierId, long adminId, string ip);
    Task<SupplierDto> ToggleSupplierStatusAsync(long supplierId, long adminId, string ip);
}
