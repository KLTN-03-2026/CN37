public interface IBankAccountService
{
    Task<List<UserBankAccount>> GetMyBankAccountsAsync(int userId);
    Task<UserBankAccount> CreateAsync(int userId, CreateBankAccountRequest request);
    Task DeleteAsync(int userId, int bankAccountId);
}