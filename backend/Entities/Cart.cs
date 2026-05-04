public class Cart
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public User User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public List<CartItem> CartItems { get; set; } = new List<CartItem>();
}