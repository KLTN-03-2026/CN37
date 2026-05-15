using Microsoft.EntityFrameworkCore;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>>
        GetPersonalizedProducts(
            long userId)
    {
        var viewedIds =
            await _context.ProductViews
                .Where(x => x.UserId == userId)
                .Select(x => x.ProductId)
                .ToListAsync();

        var categories =
            await _context.Products
                .Where(x => viewedIds.Contains(x.Id))
                .Select(x => x.CategoryId)
                .Distinct()
                .ToListAsync();

        return await _context.Products
            .Where(x =>
                categories.Contains(x.CategoryId))
            .Take(10)
            .ToListAsync();
    }
}
