using Microsoft.EntityFrameworkCore;

public class BankAccountService : IBankAccountService
{
    private readonly AppDbContext _context;

    public BankAccountService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserBankAccount>> GetMyBankAccountsAsync(int userId)
    {
        return await _context.UserBankAccounts
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.IsDefault)
            .ThenByDescending(x => x.Id)
            .ToListAsync();
    }

    public async Task<UserBankAccount> CreateAsync(
        int userId,
        CreateBankAccountRequest request)
    {
        if (request.IsDefault)
        {
            var oldDefaults = await _context.UserBankAccounts
                .Where(x => x.UserId == userId && x.IsDefault)
                .ToListAsync();

            foreach (var item in oldDefaults)
                item.IsDefault = false;
        }

        var bankAccount = new UserBankAccount
        {
            UserId = userId,
            BankName = request.BankName,
            BankAccountNumber = request.BankAccountNumber,
            BankAccountName = request.BankAccountName,
            IsDefault = request.IsDefault,
            BankLogo = request.BankLogo
        };

        _context.UserBankAccounts.Add(bankAccount);
        await _context.SaveChangesAsync();

        return bankAccount;
    }

    public async Task DeleteAsync(int userId, int bankAccountId)
    {
        var bankAccount = await _context.UserBankAccounts
            .FirstOrDefaultAsync(x => x.Id == bankAccountId && x.UserId == userId);

        if (bankAccount == null)
            throw new Exception("Không tìm thấy tài khoản ngân hàng");

        _context.UserBankAccounts.Remove(bankAccount);
        await _context.SaveChangesAsync();
    }
}