public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync(ProductFilterRequest filter);
    Task<ProductDto> GetByIdAsync(long id);
    Task<long> CreateAsync(ProductCreateUpdateDto dto);
    Task<bool> UpdateAsync(long id, ProductCreateUpdateDto dto);
    Task ToggleActiveAsync(long id);
}