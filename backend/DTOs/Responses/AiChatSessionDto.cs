public class AiChatSessionDto
{
    public long Id { get; set; }
    public long? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<AiChatMessageDto> Messages { get; set; } = new();
}
