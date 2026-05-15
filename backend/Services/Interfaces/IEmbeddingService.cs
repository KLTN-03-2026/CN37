public interface IEmbeddingService
{
    Task<List<float>> CreateEmbeddingAsync(
        string text);
}