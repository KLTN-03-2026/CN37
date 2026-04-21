using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly AppDbContext _context;

    public OrderService(IOrderRepository orderRepository, AppDbContext context)
    {
        _orderRepository = orderRepository;
        _context = context;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            if (request.Items == null || !request.Items.Any())
                throw new Exception("Order must have items");

            var productIds = request.Items.Select(i => i.ProductId).ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            var inventories = await _context.Inventories
                .Where(i => productIds.Contains(i.ProductId))
                .ToListAsync();

            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in request.Items)
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                if (product == null)
                    throw new Exception($"Product {item.ProductId} not found");

                var inventory = inventories.FirstOrDefault(i => i.ProductId == item.ProductId);
                if (inventory == null || inventory.Quantity < item.Quantity)
                    throw new Exception($"Sản phẩm {product.Name} không đủ hàng");

                inventory.Quantity -= item.Quantity;

                _context.InventoryLogs.Add(new InventoryLog
                {
                    ProductId = item.ProductId,
                    ChangeType = "order",
                    QuantityChanged = -item.Quantity,
                    Note = "Order pending"
                });

                var price = product.Price;
                totalAmount += price * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = price
                });
            }

            var order = new Order
            {
                UserId = request.UserId,
                AddressId = request.AddressId,
                TotalAmount = totalAmount,
                Status = "Pending",
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = "Pending",
                CreateAt = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            orderItems.ForEach(i => i.OrderId = order.Id);
            _context.OrderItems.AddRange(orderItems);

            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMethod = request.PaymentMethod,
                Amount = totalAmount,
                Status = "Pending"
            };

            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}