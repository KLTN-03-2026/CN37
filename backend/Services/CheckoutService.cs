using Microsoft.EntityFrameworkCore;

public class CheckoutService : ICheckoutService
{
    private readonly AppDbContext _context;

    public CheckoutService(AppDbContext context)
    {
        _context = context;
    }

    // 👉 BUY NOW
    public async Task<CheckoutResponseDto> BuyNow(long productId, int quantity)
    {
        var product = await _context.Products.FindAsync(productId);

        if (product == null) throw new Exception("Product not found");

        var price = product.DiscountPrice ?? product.Price;

        return new CheckoutResponseDto
        {
            Items = new List<CartItemDto>
            {
                new CartItemDto
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Thumbnail = product.Thumbnail,
                    Price = product.Price,
                    DiscountPrice = product.DiscountPrice,
                    Quantity = quantity
                }
            },
            TotalAmount = price * quantity
        };
    }

    // 👉 CART
    public async Task<CheckoutResponseDto> GetCheckoutFromItems(List<CheckoutItemRequest> items)
    {
        if (items == null || !items.Any())
            throw new Exception("Danh sách sản phẩm trống");

        var productIds = items.Select(x => x.ProductId).ToList();

        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        var resultItems = new List<CartItemDto>();

        foreach (var item in items)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId);

            if (product == null)
                throw new Exception($"Sản phẩm {item.ProductId} không tồn tại");

            // if (item.Quantity > product.Stock)
            //     throw new Exception($"Sản phẩm {product.Name} không đủ hàng");

            resultItems.Add(new CartItemDto
            {
                ProductId = product.Id,
                Name = product.Name,
                Thumbnail = product.Thumbnail,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                Quantity = item.Quantity
            });
        }

        return new CheckoutResponseDto
        {
            Items = resultItems
        };
    }

    // // 👉 CREATE ORDER
    // public async Task<long> CreateOrder(long userId, CreateOrderRequest request)
    // {
    //     using var transaction = await _context.Database.BeginTransactionAsync();

    //     try
    //     {
    //         var order = new Order
    //         {
    //             UserId = userId,
    //             AddressId = request.AddressId,
    //             Status = "Chờ xác nhận",
    //             PaymentMethod = request.PaymentMethod,
    //             PaymentStatus = "Chưa thanh toán",
    //             CreateAt = DateTime.Now
    //         };

    //         _context.Orders.Add(order);
    //         await _context.SaveChangesAsync();

    //         decimal total = 0;

    //         foreach (var item in request.Items)
    //         {
    //             var product = await _context.Products.FindAsync(item.ProductId);
    //             var inventory = await _context.Inventory
    //                 .FirstOrDefaultAsync(x => x.ProductId == item.ProductId);

    //             if (inventory.Quantity < item.Quantity)
    //                 throw new Exception("Not enough stock");

    //             var price = product.DiscountPrice ?? product.Price;

    //             total += price * item.Quantity;

    //             _context.OrderItems.Add(new OrderItem
    //             {
    //                 OrderId = order.Id,
    //                 ProductId = item.ProductId,
    //                 Price = price,
    //                 Quantity = item.Quantity
    //             });

    //             // Trừ kho
    //             inventory.Quantity -= item.Quantity;

    //             _context.InventoryLogs.Add(new InventoryLog
    //             {
    //                 ProductId = item.ProductId,
    //                 ChangeType = "order",
    //                 QuantityChange = -item.Quantity,
    //                 Note = $"Order #{order.Id}"
    //             });
    //         }

    //         order.TotalAmount = total;

    //         await _context.SaveChangesAsync();
    //         await transaction.CommitAsync();

    //         return order.Id;
    //     }
    //     catch
    //     {
    //         await transaction.RollbackAsync();
    //         throw;
    //     }
    // }
}