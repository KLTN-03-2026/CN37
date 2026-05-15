public interface IProductRetrievalService
{
    Task<List<Product>> SearchProducts(
        string userMessage
    );
}