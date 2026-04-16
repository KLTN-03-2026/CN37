public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync(ProductFilterRequest filter);
    Task<ProductDto> GetByIdAsync(long id);
    Task CreateAsync(ProductCreateRequest request);
    Task UpdateAsync(ProductUpdateRequest request);
    Task ToggleActiveAsync(long id);
}