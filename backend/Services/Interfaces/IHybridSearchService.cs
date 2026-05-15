public interface IHybridSearchService
{
    Task<List<Product>> SearchAsync(
        string query);
}