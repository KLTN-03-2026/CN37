using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/admin/suppliers")]
public class SupplierController : ControllerBase
{
    private readonly ISupplierService _supplierService;
    private readonly IAuditService _audit;

    public SupplierController(ISupplierService supplierService, IAuditService audit)
    {
        _supplierService = supplierService;
        _audit = audit;
    }

    private long GetAdminId()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return long.TryParse(sub, out var id) ? id : 0;
    }

    private string GetIp() => HttpContext.Connection.RemoteIpAddress?.ToString();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSupplierRequest request)
    {
        try
        {
            var adminId = GetAdminId();
            var supplier = await _supplierService.CreateSupplierAsync(request, adminId, GetIp());
            return CreatedAtAction(nameof(Get), new { id = supplier.Id }, supplier);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // [HttpGet]
    // public async Task<IActionResult> GetAll()
    // {
    //     try
    //     {
    //         var supplier = await _supplierService.GetAllSupplierAsync();
    //         return Ok(supplier);
    //     }
    //     catch (Exception ex)
    //     {
    //         return NotFound(new { message = ex.Message });
    //     }
    // }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        try
        {
            var supplier = await _supplierService.GetSupplierAsync(id);
            return Ok(supplier);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateSupplierRequest request)
    {
        try
        {
            var adminId = GetAdminId();
            var supplier = await _supplierService.UpdateSupplierAsync(id, request, adminId, GetIp());
            return Ok(supplier);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var adminId = GetAdminId();
            await _supplierService.DeleteSupplierAsync(id, adminId, GetIp());
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:long}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(long id)
    {
        try
        {
            var adminId = GetAdminId();
            var supplier = await _supplierService.ToggleSupplierStatusAsync(id, adminId, GetIp());
            return Ok(supplier);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] SupplierSearchParams? p)
    {
        try
        {
            p ??= new SupplierSearchParams();

            if (p.Page <= 0) p.Page = 1;
            if (p.PageSize <= 0 || p.PageSize > 100) p.PageSize = 10;

            var result = await _supplierService.SearchSuppliersAsync(p);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
