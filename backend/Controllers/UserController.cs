using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/users")]

public class UserController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetUser()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    return Ok(new
    {
        id = userId,
        email = User.FindFirst(ClaimTypes.Email)?.Value
    });
}
}