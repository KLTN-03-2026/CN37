using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;
    private readonly AppDbContext _context;

    public InventoryController(IInventoryService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetStock(long productId)
    {
        var stock = await _service.GetStock(productId);
        return Ok(new { productId, stock });
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import([FromBody] StockRequest request)
    {
        await _service.ImportStock(request.ProductId, request.Quantity);
        return Ok("Nhập kho thành công");
    }

    [HttpPost("export")]
    public async Task<IActionResult> Export([FromBody] StockRequest request)
    {
        await _service.ExportStock(request.ProductId, request.Quantity);
        return Ok("Xuất kho thành công");
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts(
    string? search,
    string? categorySlug,
    string? status // ok | low | out
    )
    {
        var query = _context.Products
            .Include(p => p.Inventory)
            .AsQueryable();

        List<long> categoryIds = new List<long>();

        if (!string.IsNullOrEmpty(categorySlug))
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Slug == categorySlug);

            if (category != null)
            {
                categoryIds = await _context.Categories
                    .Where(c => c.Id == category.Id || c.ParentId == category.Id)
                    .Select(c => c.Id)
                    .ToListAsync();
            }
        }

        // 🔍 Search theo tên
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.Contains(search));
        }

        // 📂 Filter theo danh mục
        if (categoryIds.Any())
        {
            query = query.Where(p => categoryIds.Contains(p.CategoryId));
        }
        Console.WriteLine("id: " + query.ToQueryString()); // Debug: xem query SQL

        var products = await query
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.DiscountPrice,
                p.Thumbnail,
                p.Brand,
                p.CategoryId,
                p.Slug,

                Rating = p.RatingAvg,
                ReviewCount = p.RatingCount,

                Quantity = p.Inventory != null ? p.Inventory.Quantity : 0,

                DiscountPercent = p.DiscountPrice != null
                    ? (int)((p.Price - p.DiscountPrice) * 100 / p.Price)
                    : 0
            })
            .ToListAsync();

        // 📦 Filter theo trạng thái kho (xử lý sau khi query)
        if (!string.IsNullOrEmpty(status))
        {
            products = products.Where(p =>
            {
                if (status == "out") return p.Quantity == 0;
                if (status == "low") return p.Quantity > 0 && p.Quantity < 5;
                if (status == "ok") return p.Quantity >= 5;
                return true;
            }).ToList();
        }

        return Ok(products);
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetAllInventoryLogs()
    {
        var logs = await _context.InventoryLogs
            .Include(x => x.Product)
            .OrderByDescending(x => x.CreateAt)
            .Select(x => new
            {
                x.Id,
                x.ProductId,
                ProductName = x.Product.Name,
                x.ChangeType,
                x.QuantityChanged,
                x.QuantityBefore,
                x.QuantityAfter,
                x.CreateAt
            })
            .ToListAsync();

        return Ok(logs);
    }

    // [HttpPost("order")]
    // public async Task<IActionResult> Order([FromBody] OrderStockRequest request)
    // {
    //     await _service.DeductStockWhenOrder(
    //         request.ProductId,
    //         request.Quantity,
    //         request.OrderId
    //     );

    //     return Ok("Đặt hàng thành công");
    // }

    // [HttpPost("cancel")]
    // public async Task<IActionResult> Cancel([FromBody] OrderStockRequest request)
    // {
    //     await _service.RestoreStockWhenCancel(
    //         request.ProductId,
    //         request.Quantity,
    //         request.OrderId
    //     );

    //     return Ok("Hoàn kho thành công");
    // }
}