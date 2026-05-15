using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class SemanticSearchService : ISemanticSearchService
{
    private readonly AppDbContext _context;
    private readonly IEmbeddingService _embeddingService;

    public SemanticSearchService(
        AppDbContext context,
        IEmbeddingService embeddingService)
    {
        _context = context;
        _embeddingService = embeddingService;
    }

    public async Task<List<Product>>
        SearchAsync(string query)
    {
        var queryEmbedding =
            await _embeddingService
                .CreateEmbeddingAsync(query);

        var embeddings =
            await _context.ProductEmbeddings
                .Include(x => x.Product)
                .ToListAsync();

        var scored = embeddings
            .Select(x =>
            {
                var vector =
                    JsonSerializer.Deserialize<List<float>>(
                        x.Embedding);

                var score =
                    VectorHelper.CosineSimilarity(
                        queryEmbedding,
                        vector);

                return new
                {
                    Product = x.Product,
                    Score = score
                };
            })
            .OrderByDescending(x => x.Score)
            .Take(5)
            .Select(x => x.Product)
            .ToList();

        return scored;
    }
}