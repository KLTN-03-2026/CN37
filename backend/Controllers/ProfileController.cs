using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Authorize]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    // GET profile
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId(); // lấy từ JWT

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        return Ok(profile); // có thể null
    }

    // CREATE or UPDATE
    [HttpPost]
    public async Task<IActionResult> UpsertProfile(UserProfile model)
    {
        var userId = GetUserId();

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
        {
            model.UserId = userId;
            _context.UserProfiles.Add(model);
        }
        else
        {
            profile.FullName = model.FullName;
            profile.Phone = model.Phone;
            profile.Avatar = model.Avatar;
            profile.BirthDate = model.BirthDate;
            profile.Gender = model.Gender;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
}