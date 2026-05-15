public interface IPromptBuilderService
{
    string BuildProductContext(
        List<Product> products,
        string userMessage,
        List<Product>? recommendedProducts = null,
        string? memories = null
    );
}