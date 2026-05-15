public interface IReviewService
{
    Task<List<ReviewManagementDto>> GetByProductIdAsync(long productId);

    Task CreateAsync(long userId, CreateReviewDto dto, string baseUrl);

    Task DeleteAsync(long reviewId, long userId);

    Task<double> GetAverageRatingAsync(long productId);

    Task<int> GetTotalReviewsAsync(long productId);

    // Management methods
    Task<List<ReviewManagementDto>> GetAllReviewsAsync(
        long? productId = null,
        int? rating = null,
        bool? hasImages = null,
        bool? noReply = null,
        int page = 1,
        int pageSize = 10);

    Task<ReviewStatisticsDto> GetReviewStatisticsAsync(long? productId = null);

    Task AddReplyAsync(long userId, ReviewReplyDto dto);

    Task UpdateReplyAsync(long userId, long replyId, ReviewReplyDto dto);

    Task DeleteReplyAsync(long userId, long replyId);
}