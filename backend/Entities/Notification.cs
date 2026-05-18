public class Notification
{
    public long Id { get; set; }

    public long UserId { get; set; }

    public string Title { get; set; }
    public string Message { get; set; }

    public string Type { get; set; }

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public string? Link { get; set; }

    // Navigation
    public virtual User User { get; set; }
}