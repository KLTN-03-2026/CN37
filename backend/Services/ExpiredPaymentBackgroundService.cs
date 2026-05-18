using Microsoft.EntityFrameworkCore;

public class ExpiredPaymentBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ExpiredPaymentBackgroundService(
        IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var context =
                scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var expiredPayments = await context.Payments
                .Where(x =>
                    x.Status == "Pending" &&
                    x.ExpiredAt < DateTime.Now)
                .ToListAsync();

            foreach (var payment in expiredPayments)
            {
                payment.Status = "Expired";

                var order = await context.Orders
                    .FindAsync(payment.OrderId);

                if (order != null)
                {
                    order.Status = "Đã hủy";
                    order.PaymentStatus = "Đã hết hạn thanh toán";
                    order.UpdateAt = DateTime.Now;
                }
            }

            await context.SaveChangesAsync();

            // chạy mỗi 5 phút
            await Task.Delay(
                TimeSpan.FromHours(1),
                stoppingToken);
        }
    }
}