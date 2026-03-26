using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _context;

    public SessionController(ITokenService tokenService, AppDbContext context)
    {
        _tokenService = tokenService;
        _context = context;
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _tokenService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("get-session")]
    public async Task<IActionResult> GetSessions(string refreshToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = long.Parse(userIdClaim);

        var token = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == refreshToken);
        if (token == null) throw new Exception("Token not found");
        Console.WriteLine(userId);
        Console.WriteLine(token.TokenHash);
        var sessions = await _tokenService.GetSessionsAsync(userId, token.TokenHash);
        

        return Ok(sessions);
    }

    [HttpPost("logout-session")]
    [Authorize]
    public async Task<IActionResult> LogoutSession([FromBody] LogoutSessionRequest request)
    {
        // 1. Lấy userId từ JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var userId = long.Parse(userIdClaim);
        // 2. Gọi service
        var success = await _tokenService.LogoutSessionAsync(userId, request.sessionId);
        

        if (!success)
            return NotFound("Session not found");

        return Ok(new { message = "Logout session thành công" });
    }
}
