using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/passkey")]
public class PasskeyController : ControllerBase
{
    private readonly IPasskeyService _passkeyService;

    public PasskeyController(IPasskeyService passkeyService)
    {
        _passkeyService = passkeyService;
    }

    // ================= REGISTER =================

    [HttpPost("register-options")]
    public async Task<IActionResult> RegisterOptions([FromBody] PasskeyRegisterRequest req)
    {
        var options = await _passkeyService.CreateRegisterOptions(req.UserId, req.Email);
        return Ok(options);
    }

    [HttpPost("register-verify")]
    public async Task<IActionResult> RegisterVerify([FromBody] PasskeyRegisterVerifyRequest req)
    {
        var result = await _passkeyService.RegisterPasskey(req.UserId, req.Response);

        if (!result)
            return BadRequest("Register failed");

        return Ok(new { message = "Register success" });
    }

    // ================= LOGIN =================

    [HttpPost("login-options")]
    public async Task<IActionResult> LoginOptions()
    {
        try
        {
            var options = await _passkeyService.CreateLoginOptions();
            return Ok(options);
        }
        catch (System.Exception err)
        {
            return BadRequest(new { message = err.Message });
        }
    }

    [HttpPost("login-verify")]
    public async Task<IActionResult> LoginVerify([FromBody] PasskeyLoginVerifyRequest req)
    {
        var result = await _passkeyService.VerifyLogin(req.Response);

        if (result == null)
            return Unauthorized();

        return Ok(result); // AuthResponse (access + refresh)
    }
}