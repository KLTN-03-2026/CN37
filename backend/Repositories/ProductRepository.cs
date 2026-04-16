using Microsoft.EntityFrameworkCore;

public class ProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public IQueryable<Product> GetQuery()
    {
        return _context.Products
            .Include(p => p.Category)
            .AsQueryable();
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public async Task<Product> GetByIdAsync(long id)
    {
        return await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Specifications)
            .Include(p => p.Category) // 🔥 thêm dòng này
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}