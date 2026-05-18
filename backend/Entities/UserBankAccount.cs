public class UserBankAccount
{
    public long Id { get; set; }

    // FK
    public long UserId { get; set; }

    public string BankName { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankAccountName { get; set; }

    public bool IsDefault { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation Property
    public virtual User User { get; set; }
}