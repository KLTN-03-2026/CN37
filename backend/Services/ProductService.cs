using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService
{
    private readonly ProductRepository _repo;

    public ProductService(ProductRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<ProductDto>> GetAllAsync(ProductFilterRequest filter)
    {
        var query = _repo.GetQuery();

        // SEARCH
        if (!string.IsNullOrEmpty(filter.Search))
        {
            query = query.Where(p =>
                EF.Functions.Like(p.Name, $"%{filter.Search}%"));
        }

        // FILTER CATEGORY
        if (filter.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filter.CategoryId);
        }
        else if (filter.ParentCategoryId.HasValue)
        {
            query = query.Where(p =>
                p.Category.ParentId == filter.ParentCategoryId);
        }

        // SORT
        query = query.OrderByDescending(p => p.CreateAt);

        Console.WriteLine($"search: {filter.Search}");
        Console.WriteLine($"parent: {filter.ParentCategoryId}");
        Console.WriteLine($"child: {filter.CategoryId}");

        return await query.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            CategoryName = p.Category.Name,
            IsActive = p.IsActive,
        }
        ).ToListAsync();
    }

    public async Task<ProductDto> GetByIdAsync(long id)
    {
        var p = await _repo.GetByIdAsync(id);

        if (p == null)
            throw new Exception("không tìm thấy sản phẩm");

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            CategoryName = p.Category.Name,
            IsActive = p.IsActive
        };
    }

    public async Task CreateAsync(ProductCreateRequest req)
    {
        var product = new Product
        {
            Name = req.Name,
            CategoryId = req.CategoryId,
            Brand = req.Brand,
            Description = req.Description,
            Price = req.Price,
            DiscountPrice = req.DiscountPrice,
            Thumbnail = req.Thumbnail,
            Slug = GenerateSlug(req.Name),
            CreateAt = DateTime.Now,
            UpdateAt = DateTime.Now,
            IsActive = true
        };

        await _repo.AddAsync(product);
        await _repo.SaveAsync();
    }

    public async Task UpdateAsync(ProductUpdateRequest req)
    {
        var product = await _repo.GetByIdAsync(req.Id);

        if (product == null) throw new Exception("Not found");

        product.Name = req.Name;
        product.CategoryId = req.CategoryId;
        product.Brand = req.Brand;
        product.Description = req.Description;
        product.Price = req.Price;
        product.DiscountPrice = req.DiscountPrice;
        product.Thumbnail = req.Thumbnail;
        product.IsActive = req.IsActive;
        product.UpdateAt = DateTime.Now;

        _repo.Update(product);
        await _repo.SaveAsync();
    }

    public async Task ToggleActiveAsync(long id)
    {
        var product = await _repo.GetByIdAsync(id);

        if (product == null)
            throw new Exception("Product not found");

        product.IsActive = !product.IsActive;
        product.UpdateAt = DateTime.Now;

        _repo.Update(product);
        await _repo.SaveAsync();
    }

    private string GenerateSlug(string name)
    {
        return name.ToLower().Replace(" ", "-");
    }
}