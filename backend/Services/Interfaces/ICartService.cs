public interface ICartService
{
    Task AddToCartAsync(long userId, AddToCartRequest request);
    Task RemoveFromCartAsync(long userId, long productId);
    Task UpdateCartItemAsync(long userId, UpdateCartRequest request);
    Task<CartDto> GetCartAsync(long userId);
}