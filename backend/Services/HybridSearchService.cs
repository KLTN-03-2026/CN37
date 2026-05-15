public class HybridSearchService
    : IHybridSearchService
{
    private readonly IProductRetrievalService
        _keywordSearch;

    private readonly ISemanticSearchService
        _semanticSearch;

    public HybridSearchService(
        IProductRetrievalService keywordSearch,
        ISemanticSearchService semanticSearch)
    {
        _keywordSearch = keywordSearch;
        _semanticSearch = semanticSearch;
    }

    public async Task<List<Product>> SearchAsync(
        string query)
    {
        var keywordProducts =
            await _keywordSearch
                .SearchProducts(query);

        var semanticProducts =
            await _semanticSearch
                .SearchAsync(query);

        return keywordProducts
            .Concat(semanticProducts)
            .DistinctBy(x => x.Id)
            .Take(10)
            .ToList();
    }
}