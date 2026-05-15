using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class ProductEmbeddingService
    : IProductEmbeddingService
{
    private readonly AppDbContext _context;
    private readonly IEmbeddingService _embeddingService;

    public ProductEmbeddingService(
        AppDbContext context,
        IEmbeddingService embeddingService)
    {
        _context = context;
        _embeddingService = embeddingService;
    }


    public async Task GenerateAllEmbeddingsAsync()
    {
        var products = await _context.Products
            .Include(x => x.Specifications)
            .ToListAsync();

        foreach (var product in products)
        {
            var text = BuildProductText(product);

            var embedding =
                await _embeddingService
                    .CreateEmbeddingAsync(text);

            var existing =
                await _context.ProductEmbeddings
                    .FirstOrDefaultAsync(x =>
                        x.ProductId == product.Id);

            if (existing == null)
            {
                _context.ProductEmbeddings.Add(
                    new ProductEmbedding
                    {
                        ProductId = product.Id,
                        Embedding = JsonSerializer.Serialize(
                            embedding),
                        CreatedAt = DateTime.Now
                    });
            }
            else
            {
                existing.Embedding =
                    JsonSerializer.Serialize(
                        embedding);
            }
        }

        await _context.SaveChangesAsync();
    }

    private string BuildProductText(Product p)
    {
        var specs = "";

        if (p.Specifications != null)
        {
            specs = string.Join(
                ", ",
                p.Specifications.Select(x =>
                    $"{x.SpecName}: {x.SpecValue}")
            );
        }

        return $"""
Tên: {p.Name}
Thương hiệu: {p.Brand}
Mô tả: {p.Description}
Thông số: {specs}
""";
    }

    public async Task GenerateProductEmbeddingAsync(Product product)
    {
        var text = $"""
    {product.Name}
    {product.Brand}
    {product.Description}
    """;

        var embedding =
            await _embeddingService
                .CreateEmbeddingAsync(text);

        var entity = new ProductEmbedding
        {
            ProductId = product.Id,
            Embedding = JsonSerializer.Serialize(embedding),
            CreatedAt = DateTime.Now
        };

        _context.ProductEmbeddings.Add(entity);

        await _context.SaveChangesAsync();
    }
}