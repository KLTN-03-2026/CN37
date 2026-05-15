using Microsoft.EntityFrameworkCore;

public class ConversationMemoryService
    : IConversationMemoryService
{
    private readonly AppDbContext _context;

    public ConversationMemoryService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> BuildMemoryAsync(
        long sessionId)
    {
        var messages =
            await _context.AiChatMessages
                .Where(x => x.SessionId == sessionId)
                .OrderByDescending(x => x.CreatedAt)
                .Take(10)
                .ToListAsync();

        var memory = string.Join("\n",
            messages.Select(x =>
                $"{x.Role}: {x.Message}"));

        return memory;
    }
}