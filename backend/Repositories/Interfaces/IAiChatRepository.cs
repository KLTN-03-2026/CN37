public interface IAiChatRepository
{
    Task<AiChatSession> CreateSessionAsync(long userId);
    Task<AiChatSession> GetSessionAsync(long sessionId);
    Task<AiChatMessage> SaveMessageAsync(long sessionId, string role, string message);
    Task<List<AiChatMessage>> GetSessionMessagesAsync(long sessionId);
    Task<List<AiChatSession>> GetUserSessionsAsync(long userId);
    Task DeleteSessionAsync(long sessionId);
}
