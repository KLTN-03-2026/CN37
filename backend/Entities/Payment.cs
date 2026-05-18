public class Payment
{
    public long Id { get; set; }
    public long OrderId { get; set; }

    public string PaymentMethod { get; set; }
    public decimal Amount { get; set; }

    public string Status { get; set; }
    public string? TransactionId { get; set; }

    public string? CheckoutUrl { get; set; }
    public long? OrderCode { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public DateTime? PaidAt { get; set; }

    public DateTime CreateAt { get; set; }
    public Order Order { get; set; }
}