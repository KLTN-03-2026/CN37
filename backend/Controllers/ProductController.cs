using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;


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

    [HttpGet]
    public async Task<IActionResult> GetProducts(string categorySlug, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? brands, [FromQuery] string? sort)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Slug == categorySlug);

        if (category == null) return NotFound();

        // lấy category cha + con
        var categoryIds = await _context.Categories
            .Where(c => c.Id == category.Id || c.ParentId == category.Id)
            .Select(c => c.Id)
            .ToListAsync();

        var query = _context.Products
            .Where(p => categoryIds.Contains(p.CategoryId) && p.IsActive)
            .AsQueryable();

        // Filter by price
        if (minPrice.HasValue)
        {
            query = query.Where(p => p.DiscountPrice.HasValue
                ? p.DiscountPrice >= minPrice
                : p.Price >= minPrice);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.DiscountPrice.HasValue
                ? p.DiscountPrice <= maxPrice
                : p.Price <= maxPrice);
        }

        // Filter by brands
        if (!string.IsNullOrEmpty(brands))
        {
            var brandList = brands.Split(",").Select(b => b.Trim()).ToList();
            query = query.Where(p => brandList.Contains(p.Brand));
        }

        // Sort
        if (!string.IsNullOrEmpty(sort))
        {
            switch (sort)
            {
                case "price-asc":
                    query = query.OrderBy(p => p.DiscountPrice ?? p.Price);
                    break;
                case "price-desc":
                    query = query.OrderByDescending(p => p.DiscountPrice ?? p.Price);
                    break;
                case "discount":
                    query = query.OrderByDescending(p =>
                        p.DiscountPrice.HasValue
                            ? (p.Price - p.DiscountPrice.Value) * 100 / p.Price
                            : 0);
                    break;
                default:
                    query = query.OrderByDescending(p => p.CreateAt);
                    break;
            }
        }
        else
        {
            query = query.OrderByDescending(p => p.CreateAt);
        }

        var products = await query
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.DiscountPrice,
                p.Thumbnail,
                Rating = p.RatingAvg,
                ReviewCount = p.RatingCount,
                p.Brand,
                p.Slug,
                DiscountPercent = p.DiscountPrice != null
                    ? (int)((p.Price - p.DiscountPrice) * 100 / p.Price)
                    : 0,
                Specs = _context.productSpecifications
                    .Where(s => s.ProductId == p.Id)
                    .Select(s => s.SpecValue)
                    .Take(3)
                    .ToList()
            })
            .ToListAsync();

        return Ok(products);
    }


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

    [Authorize(Roles = "ADMIN")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAll([FromQuery] ProductFilterRequest filter)
    {
        var result = await _service.GetAllAsync(filter);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpGet("admin/{id}")]
    public async Task<IActionResult> Get(long id)
    {
        var product = await _service.GetByIdAsync(id);

        if (product == null)
            return NotFound(new { message = "Product not found" });

        return Ok(new { product });
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost("admin")]
    public async Task<IActionResult> Create([FromForm] ProductCreateUpdateDto dto)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var id = await _service.CreateAsync(dto, baseUrl);
        return Ok(new { id });
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("admin/{id}")]
    public async Task<IActionResult> Update(long id, [FromForm] ProductCreateUpdateDto dto)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var result = await _service.UpdateAsync(id, dto, baseUrl);
        if (!result) return NotFound();

        return Ok();
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPatch("admin/toggle-active/{id}")]
    public async Task<IActionResult> ToggleActive(long id)
    {
        await _service.ToggleActiveAsync(id);
        return Ok();
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword) || keyword.Length < 1)
            return Ok(new List<ProductSearchDto>());

        var results = await _service.SearchAsync(keyword);
        return Ok(results);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpGet("export-excel")]
    public async Task<IActionResult> ExportExcel()
    {
        var products = await _context.Products
            .Include(p => p.Category)
                .ThenInclude(c => c.Parent)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Danh sách sản phẩm");

        // ===== TIÊU ĐỀ =====

        worksheet.Range("A1:H1").Merge();
        worksheet.Cell("A1").Value = "DANH SÁCH SẢN PHẨM";

        worksheet.Cell("A1").Style.Font.Bold = true;
        worksheet.Cell("A1").Style.Font.FontSize = 20;
        worksheet.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Cell("A1").Style.Fill.BackgroundColor = XLColor.Green;
        worksheet.Cell("A1").Style.Font.FontColor = XLColor.White;

        // ===== NGÀY XUẤT =====

        worksheet.Range("A2:H2").Merge();
        worksheet.Cell("A2").Value = $"Ngày xuất: {DateTime.Now:dd/MM/yyyy HH:mm}";

        worksheet.Cell("A2").Style.Font.Italic = true;
        worksheet.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

        // ===== HEADER =====

        int headerRow = 4;

        worksheet.Cell(headerRow, 1).Value = "STT";
        worksheet.Cell(headerRow, 2).Value = "Tên sản phẩm";
        worksheet.Cell(headerRow, 3).Value = "Danh mục cha";
        worksheet.Cell(headerRow, 4).Value = "Danh mục con";
        worksheet.Cell(headerRow, 5).Value = "Thương hiệu";
        worksheet.Cell(headerRow, 6).Value = "Giá bán";
        worksheet.Cell(headerRow, 7).Value = "Trạng thái";
        worksheet.Cell(headerRow, 8).Value = "Ngày tạo";

        var headerRange = worksheet.Range($"A{headerRow}:H{headerRow}");

        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.DarkGreen;
        headerRange.Style.Font.FontColor = XLColor.White;
        headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        // ===== DỮ LIỆU =====

        int row = headerRow + 1;
        int stt = 1;

        foreach (var item in products)
        {
            worksheet.Cell(row, 1).Value = stt++;

            worksheet.Cell(row, 2).Value = item.Name ?? "N/A";

            worksheet.Cell(row, 3).Value =
                item.Category?.Parent?.Name ?? "N/A";

            worksheet.Cell(row, 4).Value =
                item.Category?.Name ?? "N/A";

            worksheet.Cell(row, 5).Value = item.Brand ?? "N/A";

            worksheet.Cell(row, 6).Value = item.Price;

            worksheet.Cell(row, 7).Value =
                item.IsActive ? "Hoạt động" : "Khóa";

            worksheet.Cell(row, 8).Value =
                item.CreateAt.ToString("dd/MM/yyyy");

            // Border

            var dataRange = worksheet.Range($"A{row}:H{row}");

            dataRange.Style.Border.OutsideBorder =
                XLBorderStyleValues.Thin;

            dataRange.Style.Border.InsideBorder =
                XLBorderStyleValues.Thin;

            // Zebra Row

            if (row % 2 == 0)
            {
                dataRange.Style.Fill.BackgroundColor =
                    XLColor.LightGray;
            }

            row++;
        }

        // ===== FORMAT GIÁ =====

        worksheet.Column(6).Style.NumberFormat.Format = "#,##0 VNĐ";

        // ===== CĂN CHỈNH =====

        worksheet.Columns().AdjustToContents();

        worksheet.Column(1).Width = 8;
        worksheet.Column(2).Width = 40;
        worksheet.Column(3).Width = 20;
        worksheet.Column(4).Width = 20;

        // ===== FREEZE HEADER =====

        worksheet.SheetView.FreezeRows(headerRow);

        // ===== XUẤT FILE =====

        using var stream = new MemoryStream();

        workbook.SaveAs(stream);

        return File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"DanhSachSanPham_{DateTime.Now:ddMMyyyy}.xlsx"
        );
    }
}