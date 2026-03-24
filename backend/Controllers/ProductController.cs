using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(string categorySlug)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Slug == categorySlug);

        if (category == null) return NotFound();

        // lấy category cha + con
        var categoryIds = await _context.Categories
            .Where(c => c.Id == category.Id || c.ParentId == category.Id)
            .Select(c => c.Id)
            .ToListAsync();

        var products = await _context.Products
            .Where(p => categoryIds.Contains(p.CategoryId))
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price, // giá gốc
                p.DiscountPrice, // giá KM
                p.Thumbnail,

                Rating = p.RatingAvg,
                ReviewCount = p.RatingCount,

                // 🔥 tính % giảm giá
                DiscountPercent = p.DiscountPrice != null
                    ? (int)((p.Price - p.DiscountPrice) * 100 / p.Price)
                    : 0,

                // 🔥 lấy specs
                Specs = _context.productSpecifications
                    .Where(s => s.ProductId == p.Id)
                    .Select(s => s.SpecValue)
                    .Take(3)
                    .ToList()
            })
            .ToListAsync();

        return Ok(products);
    }
}