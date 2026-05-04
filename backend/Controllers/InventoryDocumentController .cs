using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/inventory-documents")]
public class InventoryDocumentController : ControllerBase
{
    private readonly IInventoryDocumentService _service;
    private readonly AppDbContext _context;


    public InventoryDocumentController(IInventoryDocumentService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }
    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetImports(string? search)
    {
        var query = _context.InventoryImports
            .Include(x => x.Supplier)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(x =>
                x.Code.Contains(search));
        }

        var data = await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Code,
                SupplierName = x.Supplier != null ? x.Supplier.Name : "",
                x.TotalAmount,
                x.Status,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost("import")]
    public async Task<IActionResult> CreateImport(CreateImportRequest request)
    {
        long userId = GetUserId(); // TODO: lấy từ JWT

        var id = await _service.CreateImportAsync(request, userId);

        return Ok(new { message = "Nhập kho thành công", id });
    }

    [HttpPost("export")]
    public async Task<IActionResult> CreateExport(CreateExportRequest request)
    {
        long userId = GetUserId();

        var id = await _service.CreateExportAsync(request, userId);

        return Ok(new { message = "Xuất kho thành công", id });
    }
}