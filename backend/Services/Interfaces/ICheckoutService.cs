public interface ICheckoutService
{
    Task<CheckoutResponseDto> BuyNow(long productId, int quantity);
    Task<CheckoutResponseDto> GetCheckoutFromItems(List<CheckoutItemRequest> items);
}