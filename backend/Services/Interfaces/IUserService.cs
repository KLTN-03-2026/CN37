public interface IUserService
    {
        Task<UserDto> CreateUserAsync(CreateUserRequest request, long adminId, string ip);
        Task<UserDto> UpdateUserAsync(long userId, UpdateUserRequest request, long adminId, string ip);
        Task<UserDto> GetUserAsync(long userId);
        Task<PagedResult<UserDto>> SearchUsersAsync(UserSearchParams p);
        Task LockUnlockUserAsync(long userId, bool lockAccount, long adminId, string ip);
        Task SoftDeleteUserAsync(long userId, long adminId, string ip);
        Task AssignRoleAsync(long userId, long roleId, long adminId, string ip);
        Task<string> GeneratePasswordResetTokenAsync(long userId, long adminId, string ip);
        Task ResetPasswordUsingTokenAsync(string token, string newPassword);
    }