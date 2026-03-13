using System.Diagnostics;
using System.Net;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IEmailVerificationService _emailVerify;
    private readonly IEmailSender _emailSender;
    public AuthController(IAuthService authService, IEmailVerificationService emailVerification, IEmailSender emailSender)
    {
        _authService = authService;
        _emailVerify = emailVerification;
        _emailSender = emailSender;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (System.Exception ex)
        {   
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> LogIn([FromBody] LoginRequest request)
    {
        try
        {  
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> LogOut([FromBody] LogOutRequest request)
    {
        try
        {
            await _authService.LogOutAsync(request);
            return Ok("Đăng xuất thành công");
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
        

    }

    [HttpGet("email-verify")]
    public async Task<IActionResult> EmailVerify(string token)
    {
        await _emailVerify.VerifyEmailTokenAsync(token);
        return Ok("Xác thực email thành công.");
    }
}