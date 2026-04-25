using System.Text.RegularExpressions;
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
                    throw new Exception($"Sản phẩm này hiện tại không đủ hàng");

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
                Note = request.Note,
                Status = "Đang xử lý",
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = "Đang xử lí",
                CreateAt = DateTime.Now,
                UpdateAt = DateTime.Now
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

            if (request.Type == "cart")
            {
                var cartItems = await _context.CartItems
                    .Where(c => c.Cart.UserId == request.UserId
                        && productIds.Contains(c.ProductId))
                    .ToListAsync();

                foreach (var item in request.Items)
                {
                    var cartItem = cartItems.FirstOrDefault(c => c.ProductId == item.ProductId);

                    if (cartItem != null)
                    {
                        _context.CartItems.Remove(cartItem);
                    }
                }
            }

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

    public async Task<List<OrderDto>> GetOrdersAsync(long userId, OrderQueryRequest? query)
    {
        var orders = _context.Orders
            .Include(o => o.User)
            .Include(o => o.Address)
            .Where(o => o.UserId == userId);

        if (!string.IsNullOrEmpty(query.Status))
        {
            orders = orders.Where(o => o.Status == query.Status);
        }

        if (!string.IsNullOrEmpty(query.Keyword))
        {
            var keyword = Regex.Replace(query.Keyword.Trim(), @"\s+", " ");
            Console.WriteLine($"[GetOrdersAsync] Searching for keyword: '{keyword}'");
            orders = orders.Where(o =>
                o.OrderItems.Any(i =>
                    i.Product.Name.ToLower().Contains(keyword.ToLower())
                )
            );
        }

        var result = await orders
            .OrderByDescending(o => o.UpdateAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerName = o.Address.ReceiverName,
                Phone = o.Address.ReceiverPhone,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                UpdateAt = o.UpdateAt,
                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Thumbnail = i.Product.Thumbnail,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            })
            .ToListAsync();

        return result;
    }

    public async Task CancelOrderAsync(long userId, long orderId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new Exception("Đơn hàng không tồn tại");

        if (order.Status != OrderStatus.Pending)
            throw new Exception("Chỉ có thể hủy đơn hàng đang xử lý");

        order.Status = OrderStatus.Cancelled;
        order.UpdateAt = DateTime.Now;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAddressAsync(long userId, long orderId, long newAddressId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new Exception("Đơn hàng không tồn tại");

        if (order.Status != OrderStatus.Pending)
            throw new Exception("Chỉ có thể cập nhật địa chỉ cho đơn hàng đang xử lý");

        order.AddressId = newAddressId;
        order.UpdateAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }

    //ADMIN
    public async Task<List<OrderDto>> GetAllOrdersAsync(AdminOrderQueryRequest query)
    {
        var orders = _context.Orders
            .Include(o => o.User)
            .Include(o => o.Address)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Status))
        {
            orders = orders.Where(o => o.Status == query.Status);
        }

        if (!string.IsNullOrEmpty(query.Search))
        {
            orders = orders.Where(o =>
                o.User.Email.Contains(query.Search));
        }

        return await _context.Orders
    .Where(o => string.IsNullOrEmpty(query.Status) || o.Status == query.Status)
    .Where(o => string.IsNullOrEmpty(query.Search) || o.User.Email.Contains(query.Search))
    .OrderByDescending(o => o.CreateAt)
    .Select(o => new OrderDto
    {
        Id = o.Id,
        CustomerName = o.Address.ReceiverName,
        Phone = o.Address.ReceiverPhone,
        Address = o.Address == null
            ? ""
            : o.Address.Street + ", " + o.Address.Ward + ", " + o.Address.District + ", " + o.Address.Province,

        TotalAmount = o.TotalAmount,
        Status = o.Status,
        UpdateAt = o.UpdateAt,

        Items = o.OrderItems.Select(i => new OrderItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product.Name,
            Thumbnail = i.Product.Thumbnail,
            Price = i.Price,
            Quantity = i.Quantity
        }).ToList()
    })
    .ToListAsync();
    }

    public async Task<OrderDetailDto> GetOrderDetailAsync(long orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Address)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            throw new Exception("Order not found");

        return new OrderDetailDto
        {
            Id = order.Id,
            CustomerName = order.Address.ReceiverName,
            Phone = order.Address.ReceiverPhone,
            Address = $"{order.Address.Street}, {order.Address.Ward}, {order.Address.District}, {order.Address.Province}",
            TotalAmount = order.TotalAmount,
            Status = order.Status,

            Items = order.OrderItems.Select(i => new OrderItemDto
            {
                ProductName = i.Product.Name,
                Thumbnail = i.Product.Thumbnail,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList()
        };
    }

    public async Task UpdateOrderStatusAsync(long orderId, string newStatus)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var order = await _context.Orders.FindAsync(orderId);
        if (order == null)
            throw new Exception("Order not found");

        var current = order.Status;

        // ❌ validate flow
        if (current == OrderStatus.Pending && newStatus == OrderStatus.Shipping)
        {
            order.Status = newStatus;
        }
        else if (current == OrderStatus.Shipping && newStatus == OrderStatus.Completed)
        {
            order.Status = newStatus;

            // 💰 cộng doanh thu
            // _context.Revenues.Add(new Revenue
            // {
            //     OrderId = order.Id,
            //     Amount = order.TotalAmount
            // });
        }
        else
        {
            throw new Exception("Invalid status transition");
        }

        // 📝 log
        // _context.OrderLogs.Add(new OrderLog
        // {
        //     OrderId = order.Id,
        //     Status = newStatus,
        //     Note = $"Changed from {current} to {newStatus}"
        // });

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
}