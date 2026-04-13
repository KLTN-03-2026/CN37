using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/categories")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICategoryService _service;
    public CategoryController(AppDbContext context, ICategoryService service)
    {
        _context = context;
        _service = service;
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

    [Authorize]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpPost("admin")]
    public async Task<IActionResult> Create(CreateCategoryRequest req)
        => Ok(await _service.CreateAsync(req));

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, UpdateCategoryRequest req)
        => Ok(await _service.UpdateAsync(id, req));

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}

