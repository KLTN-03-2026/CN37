using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class ProductRetrievalService
    : IProductRetrievalService
{
    private readonly AppDbContext _context;

    public ProductRetrievalService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> SearchProducts(
        string userMessage)
    {
        userMessage = userMessage.ToLower();

        decimal? maxPrice = ExtractMaxPrice(
            userMessage
        );

        var query = _context.Products
            .Include(x => x.Category)
            .Include(x => x.Specifications)
            .Where(x => x.IsActive);

        // =========================
        // CATEGORY DETECTION
        // =========================

        if (userMessage.Contains("máy lạnh") ||
    userMessage.Contains("điều hòa"))
        {
            query = query.Where(x =>

                x.Name.ToLower().Contains("máy lạnh")

                ||

                x.Category.Name.ToLower().Contains("điều hòa")
            );
        }

        // =========================
        // BRAND DETECTION
        // =========================

        if (userMessage.Contains("casper"))
        {
            query = query.Where(x =>
                x.Brand != null &&
                x.Brand.ToLower()
                    .Contains("casper")
            );
        }

        if (userMessage.Contains("comfee"))
        {
            query = query.Where(x =>
                x.Brand != null &&
                x.Brand.ToLower()
                    .Contains("comfee")
            );
        }

        if (userMessage.Contains("daikin"))
        {
            query = query.Where(x =>
                x.Brand != null &&
                x.Brand.ToLower()
                    .Contains("daikin")
            );
        }

        if (userMessage.Contains("toshiba"))
        {
            query = query.Where(x =>
                x.Brand != null &&
                x.Brand.ToLower()
                    .Contains("toshiba")
            );
        }

        // =========================
        // PRICE FILTER
        // =========================

        if (maxPrice.HasValue)
        {
            query = query.Where(x =>
                (x.DiscountPrice ?? x.Price)
                <= maxPrice.Value);
        }

        // =========================
        // SORT
        // =========================

        query = query
            .OrderByDescending(x => x.RatingAvg)
            .ThenBy(x => x.Price);

        var products = await query
            .Take(3)
            .ToListAsync();

        // DEBUG
        Console.WriteLine("===== RETRIEVAL =====");

        foreach (var p in products)
        {
            Console.WriteLine(p.Name);
        }

        return products;
    }

    private decimal? ExtractMaxPrice(
        string message)
    {
        var match = Regex.Match(
            message,
            @"(\d+)\s*triệu"
        );

        if (!match.Success)
            return null;

        var million = decimal.Parse(
            match.Groups[1].Value);

        return million * 1000000;
    }
}