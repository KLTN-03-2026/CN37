using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly ITokenService _tokenService;

    public SessionController(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody]RefreshTokenRequest request)
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
}
