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

    [HttpPost("cart")]
    public async Task<IActionResult> Cart([FromBody] CartDto request)
    {
        Console.WriteLine($"Number of items in cart: {request.Items.Count}");
        // var userId = GetUserId();

        // var result = await _checkoutService.FromCart(userId, request.Items);

        return Ok();
    }
}
