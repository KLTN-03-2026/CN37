using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    public async Task JoinUserGroup(string userId)
    {
        Console.WriteLine($"Client {Context.ConnectionId} join group user_{userId}");

        await Groups.AddToGroupAsync(
            Context.ConnectionId,
            $"user_{userId}"
        );
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"SignalR connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"SignalR disconnected: {Context.ConnectionId}");
        return base.OnDisconnectedAsync(exception);
    }
}