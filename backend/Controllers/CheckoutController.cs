using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutService _checkoutService;

    public CheckoutController(ICheckoutService checkoutService)
    {
        _checkoutService = checkoutService;
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }

    [HttpGet("buy-now")]
    public async Task<IActionResult> BuyNow(long productId, int quantity)
    {
        var result = await _checkoutService.BuyNow(productId, quantity);
        return Ok(result);
    }

    [HttpPost("from-cart-items")]
    public async Task<IActionResult> GetFromCartItems([FromBody] CheckoutFromCartRequest request)
    {
        var result = await _checkoutService.GetCheckoutFromItems(request.Items);
        return Ok(result);
    }
}
