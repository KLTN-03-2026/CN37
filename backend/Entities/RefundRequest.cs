public class RefundRequest
{
    public long Id { get; set; }

    // FK
    public long OrderId { get; set; }
    public long UserId { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = "Pending";
    // Pending, Refunded, Rejected

    public string? Reason { get; set; }

    public string BankName { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankAccountName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? RefundedAt { get; set; }

    // Navigation Properties
    public virtual Order Order { get; set; }
    public virtual User User { get; set; }
}