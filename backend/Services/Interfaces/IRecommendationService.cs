public interface IRecommendationService
{
    Task<List<Product>>GetPersonalizedProducts(long userId);
}