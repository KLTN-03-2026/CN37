public interface IAuditService
{
    Task LogAsync(long? actorUserId, long? targetUserId, string action, string details, string ip);
    Task<PagedResult<UserDto>> GetLogsForTargetAsync(long targetUserId, int page, int pageSize);
}