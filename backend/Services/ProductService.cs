using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService
{
    private readonly ProductRepository _repo;
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductService(ProductRepository repo, AppDbContext context, IWebHostEnvironment env)
    {
        _repo = repo;
        _context = context;
        _env = env;
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

    public async Task<long> CreateAsync(ProductCreateUpdateDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Slug = GenerateSlug(dto.Name),
            CategoryId = dto.CategoryId,
            Brand = dto.Brand,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            CreateAt = DateTime.Now,
            UpdateAt = DateTime.Now
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // ====== IMAGES ======
        if (dto.Images != null && dto.Images.Any())
        {
            var images = new List<ProductImage>();

            int index = 0;
            foreach (var file in dto.Images)
            {
                var url = await SaveFile(file);

                images.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = url,
                    IsMain = index == 0,
                    SortOrder = index++
                });
            }

            _context.productImages.AddRange(images);

            // set thumbnail
            product.Thumbnail = images.First().ImageUrl;
        }

        // ====== SPECS ======
        if (dto.Specifications != null)
        {
            var specs = dto.Specifications.Select(s => new ProductSpecification
            {
                ProductId = product.Id,
                SpecName = s.SpecName,
                SpecValue = s.SpecValue
            }).ToList();

            _context.productSpecifications.AddRange(specs);
        }

        await _context.SaveChangesAsync();
        return product.Id;
    }

    public async Task<bool> UpdateAsync(long id, ProductCreateUpdateDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Specifications)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return false;

        // ====== UPDATE BASIC ======
        product.Name = dto.Name;
        product.Slug = GenerateSlug(dto.Name);
        product.CategoryId = dto.CategoryId;
        product.Brand = dto.Brand;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.UpdateAt = DateTime.Now;

        // ====== DELETE IMAGES ======
        if (dto.DeletedImageIds != null && dto.DeletedImageIds.Any())
        {
            var deleteImgs = product.Images
                .Where(i => dto.DeletedImageIds.Contains(i.Id))
                .ToList();

            _context.productImages.RemoveRange(deleteImgs);
        }

        // ====== ADD NEW IMAGES ======
        if (dto.Images != null && dto.Images.Any())
        {
            int index = product.Images.Count;

            foreach (var file in dto.Images)
            {
                var url = await SaveFile(file);

                _context.productImages.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = url,
                    SortOrder = index++
                });
            }
        }

        // ====== UPDATE SPECS ======
        _context.productSpecifications.RemoveRange(product.Specifications);

        if (dto.Specifications != null)
        {
            var specs = dto.Specifications.Select(s => new ProductSpecification
            {
                ProductId = product.Id,
                SpecName = s.SpecName,
                SpecValue = s.SpecValue
            });

            _context.productSpecifications.AddRange(specs);
        }

        // update thumbnail
        var firstImg = await _context.productImages
            .Where(i => i.ProductId == product.Id)
            .OrderBy(i => i.SortOrder)
            .FirstOrDefaultAsync();

        product.Thumbnail = firstImg?.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
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

    // ================= HELPER =================
    private async Task<string> SaveFile(IFormFile file)
    {
        var folder = Path.Combine(_env.WebRootPath, "uploads");
        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var path = Path.Combine(folder, fileName);

        using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

        return "/uploads/" + fileName;
    }
}