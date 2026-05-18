public class CreateBankAccountRequest
{
    public string BankName { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankAccountName { get; set; }
    public bool IsDefault { get; set; }
}