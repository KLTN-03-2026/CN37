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

        // 🔥 lấy cả category con
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
                p.Price,
                p.DiscountPrice,
                p.Thumbnail
            })
            .ToListAsync();

        return Ok(products);
    }
}