public class ProductView
{
    public long Id { get; set; }

    public long ProductId { get; set; }

    public long UserId { get; set; }

    public DateTime ViewTime { get; set; }

    // navigation

    public Product Product { get; set; }

    public User User { get; set; }
}