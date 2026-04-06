public interface ICheckoutService
{
    Task<CheckoutResponseDto> BuyNow(long productId, int quantity);
    Task<CheckoutResponseDto> FromCart(long userId);
}