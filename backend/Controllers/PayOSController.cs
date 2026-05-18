using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayOS;
using PayOS.Models;
using PayOS.Models.Webhooks;


[ApiController]
[Route("api/payos")]
public class PayOSController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PayOSClient _payOS;

    public PayOSController(AppDbContext context, PayOSClient payOS)
    {
        _context = context;
        _payOS = payOS;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> PayOSWebhook(
    [FromBody] Webhook webhookBody)
    {
        var verifiedData = await _payOS.Webhooks.VerifyAsync(webhookBody);

        var payment = await _context.Payments
            .FirstOrDefaultAsync(x => x.OrderCode == verifiedData.OrderCode);

        if (payment == null)
            return Ok();

        if (payment.Status == "Paid")
            return Ok();

        payment.Status = "Paid";

        var order = await _context.Orders.FindAsync(payment.OrderId);

        if (order != null)
        {
            order.PaymentStatus = "Đã thanh toán";
            order.UpdateAt = DateTime.Now;
            order.Status = "Chờ xác nhận";
        }

        await _context.SaveChangesAsync();

        return Ok();
    }
}