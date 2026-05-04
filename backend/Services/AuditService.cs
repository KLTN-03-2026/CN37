using Microsoft.EntityFrameworkCore;


public class AuditService : IAuditService
{
    private readonly AppDbContext _db;
    public AuditService(AppDbContext db) { _db = db; }

    public async Task LogAsync(long? actorUserId, long? targetUserId, string action, string details, string ip)
    {
        var a = new AuditLog
        {
            ActorUserId = actorUserId,
            TargetUserId = targetUserId,
            Action = action,
            Details = details,
            IpAddress = ip,
            CreatedAt = DateTime.Now
        };
        _db.AuditLogs.Add(a);
        await _db.SaveChangesAsync();
    }

    public async Task<PagedResult<UserDto>> GetLogsForTargetAsync(long targetUserId, int page, int pageSize)
    {
        var q = _db.AuditLogs.Where(a => a.TargetUserId == targetUserId).OrderByDescending(a => a.CreatedAt);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(a => new UserDto { Id = a.TargetUserId ?? 0, Email = "", FullName = a.Details, IsActive = true })
            .ToListAsync();
        return new PagedResult<UserDto>(items, total, page, pageSize);
    }
}