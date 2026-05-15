public class AiChatMessageDto
{
    public long Id { get; set; }
    public long SessionId { get; set; }
    public string Role { get; set; } // user / assistant
    public string Message { get; set; }
    public DateTime CreatedAt { get; set; }
}
