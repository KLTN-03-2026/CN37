using Microsoft.EntityFrameworkCore;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    private string GenerateSlug(string name)
    {
        return name.ToLower().Replace(" ", "-");
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
        var entity = new Category
        {
            Name = request.Name,
            Description = request.Description,
            ParentId = request.ParentId,
            Slug = GenerateSlug(request.Name)
        };

        _context.Categories.Add(entity);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Slug = entity.Slug,
            Description = entity.Description,
            ParentId = entity.ParentId
        };
    }

    public async Task<CategoryDto> UpdateAsync(long id, UpdateCategoryRequest request)
    {
        var entity = await _context.Categories.FindAsync(id)
                     ?? throw new Exception("Not found");

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.ParentId = request.ParentId;
        entity.Slug = GenerateSlug(request.Name);

        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Slug = entity.Slug,
            Description = entity.Description,
            ParentId = entity.ParentId
        };
    }

    public async Task DeleteAsync(long id)
    {
        var entity = await _context.Categories.FindAsync(id)
                     ?? throw new Exception("Not found");

        _context.Categories.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CategoryDto>> GetAllAsync(string? search = null)
    {
        Console.WriteLine($"search: {search}");
        if (!string.IsNullOrEmpty(search))
        {
            return await _context.Categories.Where(p => EF.Functions.Like(p.Name.ToLower().Trim(),$"%{search.ToLower().Trim()}%"))
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Description = x.Description,
                ParentId = x.ParentId
            }).ToListAsync();
        }
        else
        {
            return await _context.Categories
                .Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Slug = x.Slug,
                    Description = x.Description,
                    ParentId = x.ParentId
                }).ToListAsync();
        }
    }

    public async Task<CategoryDto?> GetByIdAsync(long id)
    {
        var x = await _context.Categories.FindAsync(id);
        if (x == null) return null;

        return new CategoryDto
        {
            Id = x.Id,
            Name = x.Name,
            Slug = x.Slug,
            Description = x.Description,
            ParentId = x.ParentId
        };
    }
}