public class AdminOrderQueryRequest
{
    public string? Status { get; set; }

    public string? OrderId { get; set; }
    public string? Product { get; set; }
    public string? Phone { get; set; }
    public string? Customer { get; set; }

    public string? Shipping { get; set; }
    public string? Payment { get; set; }

    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}