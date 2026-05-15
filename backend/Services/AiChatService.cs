using Microsoft.EntityFrameworkCore;

public class AiChatService : IAiChatService
{
    private readonly AppDbContext _context;

    private readonly IHybridSearchService
        _hybridSearchService;

    private readonly IPromptBuilderService
        _promptBuilder;

    private readonly IOpenAiService
        _openAiService;

    private readonly IAiChatRepository
        _aiChatRepository;

    private readonly IConversationMemoryService
        _memoryService;

    private readonly IRecommendationService
        _recommendationService;

    private readonly IIntentDetectionService
        _intentDetectionService;

    public AiChatService(
        AppDbContext context,

        IHybridSearchService hybridSearchService,

        IPromptBuilderService promptBuilder,

        IOpenAiService openAiService,

        IAiChatRepository aiChatRepository,

        IConversationMemoryService memoryService,

        IRecommendationService recommendationService,

        IIntentDetectionService intentDetectionService)
    {
        _context = context;

        _hybridSearchService =
            hybridSearchService;

        _promptBuilder = promptBuilder;

        _openAiService =
            openAiService;

        _aiChatRepository =
            aiChatRepository;

        _memoryService =
            memoryService;

        _recommendationService =
            recommendationService;

        _intentDetectionService =
            intentDetectionService;
    }

    public async Task<AiChatResponse>
        AskAIAsync(
            AiChatRequest request,
            long userId)
    {
        // =========================
        // CHECK INTENT
        // =========================

        var isAllowed =
            _intentDetectionService
                .IsProductRelated(
                    request.Message);

        if (!isAllowed)
        {
            return new AiChatResponse
            {
                Message =
                    """
                    Tôi chỉ hỗ trợ tư vấn
                    sản phẩm và mua sắm công nghệ.
                    """
            };
        }

        // =========================
        // GET OR CREATE SESSION
        // =========================

        AiChatSession session;

        if (request.SessionId.HasValue)
        {
            session = await _context
                .AiChatSessions
                .FirstOrDefaultAsync(x =>
                    x.Id ==
                        request.SessionId.Value
                    &&
                    x.UserId == userId);

            if (session == null)
            {
                throw new Exception(
                    "Session not found");
            }
        }
        else
        {
            session = new AiChatSession
            {
                UserId = userId,
                CreatedAt = DateTime.Now
            };

            _context.AiChatSessions
                .Add(session);

            await _context.SaveChangesAsync();
        }

        // =========================
        // SAVE USER MESSAGE
        // =========================

        _context.AiChatMessages.Add(
            new AiChatMessage
            {
                SessionId = session.Id,
                Role = "user",
                Message = request.Message,
                CreatedAt = DateTime.Now
            });

        await _context.SaveChangesAsync();

        // =========================
        // CONVERSATION MEMORY
        // =========================

        var memory =
            await _memoryService
                .BuildMemoryAsync(
                    session.Id);

        // =========================
        // HYBRID SEARCH
        // =========================

        var products =
            await _hybridSearchService
                .SearchAsync(
                    request.Message);

        // =========================
        // PERSONALIZED PRODUCTS
        // =========================

        var recommendedProducts =
            await _recommendationService
                .GetPersonalizedProducts(
                    userId);

        // =========================
        // BUILD PROMPT
        // =========================

        var prompt =
            _promptBuilder
                .BuildProductContext(
                    products,
                    request.Message,
                    recommendedProducts,
                    memory
                );
        // =========================
        // ASK AI
        // =========================

        var aiResponse =
            await _openAiService
                .AskAsync(prompt);

        // =========================
        // SAVE AI MESSAGE
        // =========================

        _context.AiChatMessages.Add(
            new AiChatMessage
            {
                SessionId = session.Id,
                Role = "assistant",
                Message = aiResponse,
                CreatedAt = DateTime.Now
            });

        await _context.SaveChangesAsync();

        // =========================
        // RETURN
        // =========================

        return new AiChatResponse
        {
            SessionId = session.Id,
            Message = aiResponse
        };
    }

    // =========================
    // GET SESSION
    // =========================

    public async Task<AiChatSessionDto>
        GetSessionAsync(long sessionId)
    {
        var session =
            await _aiChatRepository
                .GetSessionAsync(
                    sessionId);

        if (session == null)
        {
            throw new Exception(
                "Session not found");
        }

        return MapToDto(session);
    }

    // =========================
    // GET USER SESSIONS
    // =========================

    public async Task<
        List<AiChatSessionDto>>
        GetUserSessionsAsync(
            long userId)
    {
        var sessions =
            await _aiChatRepository
                .GetUserSessionsAsync(
                    userId);

        return sessions
            .Select(MapToDto)
            .ToList();
    }

    // =========================
    // DELETE SESSION
    // =========================

    public async Task DeleteSessionAsync(
        long sessionId)
    {
        await _aiChatRepository
            .DeleteSessionAsync(
                sessionId);
    }

    // =========================
    // MAP DTO
    // =========================

    private AiChatSessionDto
        MapToDto(
            AiChatSession session)
    {
        return new AiChatSessionDto
        {
            Id = session.Id,

            UserId = session.UserId,

            CreatedAt =
                session.CreatedAt,

            Messages =
                session.Messages?
                .Select(m =>
                    new AiChatMessageDto
                    {
                        Id = m.Id,

                        SessionId =
                            m.SessionId,

                        Role = m.Role,

                        Message =
                            m.Message,

                        CreatedAt =
                            m.CreatedAt
                    })
                .ToList()

                ??

                new List<
                    AiChatMessageDto>()
        };
    }
}