using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/user-addresses")]
public class UserAddressesController : ControllerBase
{
    private readonly IUserAddressService _addressService;

    public UserAddressesController(IUserAddressService addressService)
    {
        _addressService = addressService;
    }
    
    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = GetUserId();
        var addresses = await _addressService.GetAddressesAsync(userId);
        return Ok(addresses);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAddress([FromBody] UserAddressDto dto)
    {
        var userId = GetUserId();
        var address = await _addressService.AddAddressAsync(userId, dto);
        return CreatedAtAction(nameof(GetAddresses), new { userId = userId }, address);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(long id, [FromBody] UserAddressDto dto)
    {
        var updated = await _addressService.UpdateAddressAsync(id, dto);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(long id)
    {
        var deleted = await _addressService.DeleteAddressAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpPut("default/{id}")]
    public async Task<IActionResult> SetDefault(long id)
    {
        var success = await _addressService.SetDefaultAddressAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}