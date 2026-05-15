using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class OpenAiService : IOpenAiService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public OpenAiService(
        IConfiguration config,
        HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }

    public async Task<string> AskAsync(
        string prompt)
    {
        var apiKey = _config["Groq:ApiKey"];
        var model = _config["Groq:Model"];

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                apiKey
            );

        var requestBody = new
        {
            model = model,

            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },

            temperature = 0.3,
            max_tokens = 500
        };

        var json = JsonSerializer.Serialize(
            requestBody);

        var content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.PostAsync(
            "https://api.groq.com/openai/v1/chat/completions",
            content
        );

        var responseString =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(responseString);
        }

        using var doc =
            JsonDocument.Parse(responseString);

        return doc
            .RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();
    }
}