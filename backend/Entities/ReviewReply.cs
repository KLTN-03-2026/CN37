public class ReviewReply
{
    public long Id { get; set; }

    public long ReviewId { get; set; }

    public long UserId { get; set; }

    public string? Reply { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Review Review { get; set; }

    public User User { get; set; }
}
