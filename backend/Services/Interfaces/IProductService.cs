public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync(ProductFilterRequest filter);
    Task<object> GetByIdAsync(long id);
    Task<long> CreateAsync(ProductCreateUpdateDto dto, string baseUrl);
    Task<bool> UpdateAsync(long id, ProductCreateUpdateDto dto, string baseUrl);
    Task ToggleActiveAsync(long id);
}