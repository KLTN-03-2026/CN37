public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task AddUserAsync(User user);
    Task<RefreshToken?> GetRefreshToken(string refreshToken);
    Task SaveChangesAsync();
}