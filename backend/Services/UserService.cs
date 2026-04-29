using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IAuditService _audit;
    public UserService(AppDbContext context, IAuditService audit)
    {
        _context = context;
        _audit = audit;
    }
    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, long adminId, string ip)
    {
        if (string.IsNullOrWhiteSpace(request.Email)) throw new Exception("Email required");
        var exists = await _context.Users.AnyAsync(u => u.Email == request.Email && !u.IsDeleted);
        if (exists) throw new Exception("Email already exists");

        var user = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? Guid.NewGuid().ToString("N").Substring(0, 12)),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var profile = new UserProfile
        {
            UserId = user.Id,
            FullName = request.FullName,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, user.Id, "CreateUser", $"Created user {user.Email}", ip);

        return await GetUserAsync(user.Id);
    }

    public async Task<UserDto> UpdateUserAsync(long userId, UpdateUserRequest request, long adminId, string ip)
    {
        var user = await _context.Users.Include(u => u.Profile).Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) throw new Exception("User not found");

        if (request.IsActive.HasValue) user.IsActive = request.IsActive.Value;
        user.UpdatedAt = DateTime.UtcNow;

        if (user.Profile == null)
        {
            user.Profile = new UserProfile { UserId = user.Id, CreatedAt = DateTime.UtcNow };
            _context.UserProfiles.Add(user.Profile);
        }

        user.Profile.FullName = request.FullName ?? user.Profile.FullName;
        user.Profile.Phone = request.Phone ?? user.Profile.Phone;
        user.Profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _audit.LogAsync(adminId, user.Id, "UpdateUser", $"Updated user {user.Email}", ip);

        return await GetUserAsync(user.Id);
    }

    public async Task<UserDto> GetUserAsync(long userId)
    {
        var u = await _context.Users
                .Include(x => x.Profile)
                .Include(x => x.UserRoles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted);
        if (u == null) throw new KeyNotFoundException("User not found");

        return new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            IsActive = u.IsActive,
            EmailVerified = u.EmailVerified,
            FullName = u.Profile?.FullName,
            Phone = u.Profile?.Phone,
            Roles = u.UserRoles.Select(r => new RoleDto
            {
                Id = r.Role.Id,
                Name = r.Role.Name
            }).ToList(),
            IsDeleted = u.IsDeleted,
            AvatarUrl = u.Profile?.Avatar
        };

    }

    public async Task AssignRoleAsync(long userId, long roleId, long adminId, string ip)
    {
        var user = await _context.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) throw new KeyNotFoundException("User not found");
        var role = await _context.Roles.FindAsync(roleId);
        if (role == null) throw new KeyNotFoundException("Role not found");

        if (!user.UserRoles.Any(ur => ur.RoleId == roleId))
        {
            user.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
            await _context.SaveChangesAsync();
            await _audit.LogAsync(adminId, userId, "AssignRole", $"Assigned role {role.Name}", ip);
        }
    }

    public async Task RemoveRoleAsync(long userId, long roleId, long adminId, string ip)
    {
        Console.WriteLine(userId);
        Console.WriteLine(roleId);
        
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

        if (user == null) throw new KeyNotFoundException("User not found");

        var userRole = user.UserRoles.FirstOrDefault(ur => ur.RoleId == roleId);
        if (userRole == null) throw new KeyNotFoundException("User does not have this role");

        _context.UserRoles.Remove(userRole);

        await _context.SaveChangesAsync();

        var role = await _context.Roles.FindAsync(roleId);

        await _audit.LogAsync(adminId, userId, "RemoveRole", $"Removed role {role?.Name}", ip);
    }

    public async Task LockUnlockUserAsync(long userId, bool lockAccount, long adminId, string ip)
    {
        var user = await _context.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) throw new KeyNotFoundException("User not found");
        user.IsActive = !lockAccount;
        user.UpdatedAt = DateTime.UtcNow;

        if (lockAccount)
        {
            var tokens = user.RefreshTokens.Where(t => !t.IsRevoked).ToList();
            foreach (var t in tokens) { t.IsRevoked = true; t.RevokedAt = DateTime.UtcNow; }
        }

        await _context.SaveChangesAsync();
        await _audit.LogAsync(adminId, userId, lockAccount ? "LockUser" : "UnlockUser", null, ip);

    }

    public async Task<string> GeneratePasswordResetTokenAsync(long userId, long adminId, string ip)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found");

        var token = Guid.NewGuid().ToString("N");
        var tokenHash = BCrypt.Net.BCrypt.HashPassword(token);
        var prt = new ResetPasswordToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(2),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };
        _context.ResetPasswordTokens.Add(prt);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, userId, "GeneratePasswordReset", null, ip);

        return token;
    }

    public async Task ResetPasswordUsingTokenAsync(string token, string newPassword)
    {
        var tokens = await _context.ResetPasswordTokens.Where(t => !t.IsUsed && t.ExpiresAt > DateTime.UtcNow).ToListAsync();
        var matched = tokens.FirstOrDefault(t => BCrypt.Net.BCrypt.Verify(token, t.TokenHash));
        if (matched == null) throw new Exception("Invalid or expired token");

        var user = await _context.Users.FindAsync(matched.UserId);
        if (user == null) throw new KeyNotFoundException("User not found");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        matched.IsUsed = true;
        await _context.SaveChangesAsync();
    }

    public async Task<PagedResult<UserDto>> SearchUsersAsync(UserSearchParams? search)
    {
        search ??= new UserSearchParams();

        var q = _context.Users
            .Include(u => u.Profile)
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .Where(u => !u.IsDeleted)
            .AsQueryable();

        bool hasFilter =
            !string.IsNullOrWhiteSpace(search.Email) ||
            !string.IsNullOrWhiteSpace(search.FullName) ||
            search.IsActive.HasValue ||
            !string.IsNullOrWhiteSpace(search.RoleName) ||
            search.CreatedFrom.HasValue ||
            search.CreatedTo.HasValue;

        if (hasFilter)
        {
            if (!string.IsNullOrWhiteSpace(search.Email))
                q = q.Where(u => u.Email.Contains(search.Email));

            if (!string.IsNullOrWhiteSpace(search.FullName))
                q = q.Where(u => u.Profile != null && u.Profile.FullName.Contains(search.FullName));

            if (search.IsActive.HasValue)
                q = q.Where(u => u.IsActive == search.IsActive.Value);

            if (!string.IsNullOrWhiteSpace(search.RoleName))
                q = q.Where(u => u.UserRoles.Any(ur => ur.Role != null && ur.Role.Name == search.RoleName));

            if (search.CreatedFrom.HasValue)
                q = q.Where(u => u.CreatedAt >= search.CreatedFrom.Value);

            if (search.CreatedTo.HasValue)
                q = q.Where(u => u.CreatedAt <= search.CreatedTo.Value);
        }

        int page = search.Page <= 0 ? 1 : search.Page;
        int pageSize = search.PageSize <= 0 ? 10 : search.PageSize;

        var total = await q.CountAsync();

        var items = await q
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                IsActive = u.IsActive,
                EmailVerified = u.EmailVerified,
                FullName = u.Profile != null ? u.Profile.FullName : null,
                Phone = u.Profile != null ? u.Profile.Phone : null,
                Roles = u.UserRoles.Select(r => new RoleDto
                {
                    Id = r.Role.Id,
                    Name = r.Role.Name
                }).ToList(),
            })
            .ToListAsync();

        return new PagedResult<UserDto>(items, total, page, pageSize);
    }

    public async Task SoftDeleteUserAsync(long userId, long adminId, string ip)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) throw new KeyNotFoundException("User not found");
        user.IsDeleted = true;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        var tokens = await _context.RefreshTokens.Where(t => t.UserId == userId && !t.IsRevoked).ToListAsync();
        foreach (var t in tokens) { t.IsRevoked = true; t.RevokedAt = DateTime.UtcNow; }

        await _context.SaveChangesAsync();
        await _audit.LogAsync(adminId, userId, "SoftDeleteUser", null, ip);
    }
}