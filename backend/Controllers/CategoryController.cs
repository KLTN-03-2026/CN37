using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/categories")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;
    public CategoryController(AppDbContext context)
    {
        _context = context;
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.ParentId == null)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug
            })
            .ToListAsync();

        return Ok(categories);
    }
    [Authorize]
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetCategory(string slug)
    {
        var category = await _context.Categories
            .Where(c => c.Slug == slug)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Description,
                c.Slug,

                Children = c.Children.Select(child => new
                {
                    child.Id,
                    child.Name,
                    child.Slug
                })
            })
            .FirstOrDefaultAsync();

        if (category == null) return NotFound();

        return Ok(category);
    }
}

