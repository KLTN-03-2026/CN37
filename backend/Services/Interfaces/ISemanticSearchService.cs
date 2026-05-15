public interface ISemanticSearchService
{
    Task<List<Product>> SearchAsync(
        string query);
}