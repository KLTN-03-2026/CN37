using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var result = await _orderService.CreateOrderAsync(request);

        return Ok(new
        {
            message = "Đặt hàng thành công",
            orderId = result.Id,
            totalPrice = result.TotalAmount,
            createdAt = result.CreateAt
        });
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] OrderQueryRequest query)
    {
        var userId = GetUserId();

        var result = await _orderService.GetOrdersAsync(userId, query);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(long id)
    {
        var userId = GetUserId();

        await _orderService.CancelOrderAsync(userId, id);
        return Ok();
    }

    [Authorize]
    [HttpPut("{id}/address")]
    public async Task<IActionResult> UpdateAddress(long id, [FromBody] long addressId)
    {
        var userId = GetUserId();

        await _orderService.UpdateAddressAsync(userId, id, addressId);
        return Ok();
    }

    [Authorize]
    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
}