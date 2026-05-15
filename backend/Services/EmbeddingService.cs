using System.Text;
using System.Text.Json;

public class EmbeddingService : IEmbeddingService
{
    private readonly HttpClient _http;

    public EmbeddingService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<float>> CreateEmbeddingAsync(string text)
    {
        var body = new
        {
            model = "nomic-embed-text",
            prompt = text
        };

        var res = await _http.PostAsync(
            "http://localhost:11434/api/embeddings",
            new StringContent(JsonSerializer.Serialize(body),
            Encoding.UTF8, "application/json"));

        var json = await res.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);

        var arr = doc.RootElement
            .GetProperty("embedding");

        return arr.EnumerateArray()
            .Select(x => x.GetSingle())
            .ToList();
    }
}