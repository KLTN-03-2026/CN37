using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        try
        {
            var userId = GetUserId();
            await _cartService.AddToCartAsync(userId, request);
            return Ok("Product added to cart");
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateCartRequest request)
    {
        var userId = GetUserId();
        await _cartService.UpdateCartItemAsync(userId, request);
        return Ok(new { message = "Updated" });
    }

    [HttpDelete("remove/{productId}")]
    public async Task<IActionResult> Remove(long productId)
    {
        var userId = GetUserId();
        await _cartService.RemoveFromCartAsync(userId, productId);
        return Ok(new { message = "Removed" });
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        try
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
}