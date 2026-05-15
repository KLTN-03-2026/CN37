public interface IProductEmbeddingService
{
    Task GenerateProductEmbeddingAsync(Product product);
    Task GenerateAllEmbeddingsAsync();
}