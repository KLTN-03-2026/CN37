using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationController(AppDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetNotifications(long userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPost("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(long notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification == null) return NotFound();

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        // Notify the client about the update
        await _hubContext.Clients
            .Group($"user_{notification.UserId}")
            .SendAsync("NotificationRead", notificationId);

        return NoContent();
    }
}