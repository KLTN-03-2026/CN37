public interface IConversationMemoryService
{
    Task<string> BuildMemoryAsync(
        long sessionId);
}