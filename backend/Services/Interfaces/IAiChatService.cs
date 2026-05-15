public interface IAiChatService
{
    Task<AiChatResponse> AskAIAsync(AiChatRequest request, long userId);
    Task<AiChatSessionDto> GetSessionAsync(long sessionId);
    Task<List<AiChatSessionDto>> GetUserSessionsAsync(long userId);
    Task DeleteSessionAsync(long sessionId);
}