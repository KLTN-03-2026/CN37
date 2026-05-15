
public class Review
{
    public long Id { get; set; }


    public long ProductId { get; set; }


    public long UserId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreateAt { get; set; } = DateTime.Now;
    public bool VerifyPurchase { get; set; } = false;

    // Navigation
    public Product Product { get; set; }

    public User User { get; set; }

    public ICollection<ReviewImage> Images { get; set; }
        = new List<ReviewImage>();

    public ReviewReply? Reply { get; set; }
    public long OrderId { get; set; }

    public Order Order { get; set; }
}
