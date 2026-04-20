using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IProductService _service;


    public ProductController(AppDbContext context, IProductService service)
    {
        _context = context;
        _service = service;
    }

    [Authorize]
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
                p.Brand,
                p.Slug,

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

    [Authorize]
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProductDetail(string slug)
    {
        var product = await _context.Products
            .Where(p => p.Slug == slug && p.IsActive)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Brand,
                p.Price,
                p.DiscountPrice,
                p.Description,
                p.RatingAvg,
                p.RatingCount,
                p.Thumbnail,
                p.CategoryId,
                DiscountPercent = p.DiscountPrice != null
                    ? (int)((p.Price - p.DiscountPrice) * 100 / p.Price)
                    : 0,
                SaleMoney = p.Price - p.DiscountPrice,
                Images = _context.productImages
                    .Where(i => i.ProductId == p.Id)
                    .OrderByDescending(i => i.IsMain)
                    .ThenBy(i => i.SortOrder)
                    .Select(i => new
                    {
                        i.Id,
                        i.ImageUrl,
                        i.IsMain
                    }).ToList(),
                Specifications = _context.productSpecifications
                    .Where(s => s.ProductId == p.Id)
                    .Select(s => new
                    {
                        s.Id,
                        s.SpecName,
                        s.SpecValue
                    }).ToList()
            })
            .FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Product not found" });

        // Related products: cùng category, khác sản phẩm hiện tại
        var related = await _context.Products
            .Where(r => r.CategoryId == product.CategoryId && r.Id != product.Id && r.IsActive)
            .Select(r => new
            {
                r.Id,
                r.Slug,
                r.Name,
                r.Price,
                r.Thumbnail,
                r.DiscountPrice,
                r.RatingAvg,
                r.RatingCount,
                DiscountPercent = r.DiscountPrice != null
                    ? (int)((r.Price - r.DiscountPrice) * 100 / r.Price)
                    : 0
            })
            .Take(5)
            .ToListAsync();

        return Ok(new { product, related });
    }

    [HttpGet("admin")]
    public async Task<IActionResult> GetAll([FromQuery] ProductFilterRequest filter)
    {
        var result = await _service.GetAllAsync(filter);
        return Ok(result);
    }

    [HttpGet("admin/{id}")]
    public async Task<IActionResult> Get(long id)
    {
        var product = await _service.GetByIdAsync(id);

        if (product == null)
            return NotFound(new { message = "Product not found" });

        return Ok(new { product });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateUpdateDto dto)
    {
        var id = await _service.CreateAsync(dto);
        return Ok(new { id });
    }

    [HttpPut("admin/{id}")]
    public async Task<IActionResult> Update(long id, [FromForm] ProductCreateUpdateDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();

        return Ok();
    }

    [HttpPatch("admin/toggle-active/{id}")]
    public async Task<IActionResult> ToggleActive(long id)
    {
        await _service.ToggleActiveAsync(id);
        return Ok();
    }
}