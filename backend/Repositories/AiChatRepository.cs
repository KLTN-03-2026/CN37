using Microsoft.EntityFrameworkCore;

public class AiChatRepository : IAiChatRepository
{
    private readonly AppDbContext _context;

    public AiChatRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AiChatSession> CreateSessionAsync(long userId)
    {
        var session = new AiChatSession
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.AiChatSessions.Add(session);
        await _context.SaveChangesAsync();

        return session;
    }

    public async Task<AiChatSession> GetSessionAsync(long sessionId)
    {
        return await _context.AiChatSessions
            .Include(s => s.Messages)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }

    public async Task<AiChatMessage> SaveMessageAsync(long sessionId, string role, string message)
    {
        var chatMessage = new AiChatMessage
        {
            SessionId = sessionId,
            Role = role,
            Message = message,
            CreatedAt = DateTime.UtcNow
        };

        _context.AiChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();

        return chatMessage;
    }

    public async Task<List<AiChatMessage>> GetSessionMessagesAsync(long sessionId)
    {
        return await _context.AiChatMessages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<AiChatSession>> GetUserSessionsAsync(long userId)
    {
        return await _context.AiChatSessions
            .Where(s => s.UserId == userId)
            .Include(s => s.Messages)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteSessionAsync(long sessionId)
    {
        var session = await _context.AiChatSessions.FindAsync(sessionId);
        if (session != null)
        {
            _context.AiChatSessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }
}
