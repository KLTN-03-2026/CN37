using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/admin/users")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuditService _audit;
    public AdminUsersController(IUserService userService, IAuditService audit)
    {
        _userService = userService;
        _audit = audit;
    }

    private long GetAdminId()
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return long.TryParse(sub, out var id) ? id : 0;
    }

    private string GetIp() => HttpContext.Connection.RemoteIpAddress?.ToString();

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var adminId = GetAdminId();
        var token = await _userService.CreateUserAsync(request, adminId, GetIp());
        return CreatedAtAction(nameof(Get), new { id = token.Id }, token);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        var user = await _userService.GetUserAsync(id);
        return Ok(user);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateUserRequest request)
    {
        var adminId = GetAdminId();
        var updated = await _userService.UpdateUserAsync(id, request, adminId, GetIp());
        return Ok(updated);
    }

    [HttpPost("{id:long}/lock")]
    public async Task<IActionResult> Lock(long id)
    {
        var adminId = GetAdminId();
        await _userService.LockUnlockUserAsync(id, true, adminId, GetIp());
        return NoContent();
    }

    [HttpPost("{id:long}/unlock")]
    public async Task<IActionResult> Unlock(long id)
    {
        var adminId = GetAdminId();
        await _userService.LockUnlockUserAsync(id, false, adminId, GetIp());
        return NoContent();
    }

    [HttpPost("{id:long}/reset-password")]
    public async Task<IActionResult> GenerateReset(long id)
    {
        var adminId = GetAdminId();
        var token = await _userService.GeneratePasswordResetTokenAsync(id, adminId, GetIp());
        return Ok(new { token }); // admin can copy or system can email
    }

    [HttpPost("{id:long}/assign-role")]
    public async Task<IActionResult> AssignRole(long id, [FromBody] AssignRoleDto dto)
    {
        var adminId = GetAdminId();
        await _userService.AssignRoleAsync(id, dto.RoleId, adminId, GetIp());
        return NoContent();
    }

    [HttpDelete("{id:long}/remove-role/")]
    public async Task<IActionResult> RemoveRole(long id, [FromBody] AssignRoleDto dto)
    {
        var adminId = GetAdminId(); // tùy bạn implement
        await _userService.RemoveRoleAsync(id, dto.RoleId, adminId, GetIp());
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] UserSearchParams? p)
    {
        try
        {
            // 🔥 tránh null
            p ??= new UserSearchParams();

            // 🔥 validate cơ bản
            if (p.Page <= 0) p.Page = 1;
            if (p.PageSize <= 0 || p.PageSize > 100) p.PageSize = 10;

            var result = await _userService.SearchUsersAsync(p);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPost("{id:long}/soft-delete")]
    public async Task<IActionResult> SoftDelete(long id)
    {
        var adminId = GetAdminId();
        await _userService.SoftDeleteUserAsync(id, adminId, GetIp());
        return NoContent();
    }

    [HttpGet("{id:long}/audit-logs")]
    public async Task<IActionResult> GetAuditLogs(long id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var logs = await _audit.GetLogsForTargetAsync(id, page, pageSize);
        return Ok(logs);
    }
}