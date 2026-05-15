public class ReviewManagementDto
{
    public long Id { get; set; }

    public long ProductId { get; set; }

    public string? ProductName { get; set; }

    public string? ProductImage { get; set; }

    public long UserId { get; set; }

    public string? Email { get; set; }

    public string? Avatar { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool HasImages { get; set; }

    public bool HasReply { get; set; }

    public string? ReplyContent { get; set; }

    public DateTime? ReplyCreatedAt { get; set; }

    public List<string> Images { get; set; } = new();
}
