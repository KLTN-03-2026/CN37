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
    public async Task<CheckoutResponseDto> FromCart(long userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null) throw new Exception("Cart not found");

        var items = cart.CartItems.Select(ci => new CartItemDto
        {
            ProductId = ci.ProductId,
            Name = ci.Product.Name,
            Thumbnail = ci.Product.Thumbnail,
            Price = ci.Product.DiscountPrice ?? ci.Product.Price,
            Quantity = ci.Quantity
        }).ToList();

        return new CheckoutResponseDto
        {
            Items = items,
            TotalAmount = items.Sum(x => x.Price * x.Quantity)
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