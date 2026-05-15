using Microsoft.EntityFrameworkCore;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewManagementDto>> GetByProductIdAsync(long productId)
    {
        var query = _context.Reviews
            .Include(x => x.Product)
                .ThenInclude(x => x.Images)
            .Include(x => x.User)
                .ThenInclude(x => x.Profile)
            .Include(x => x.Images)
            .Include(x => x.Reply)
            .Where(x => x.ProductId == productId)
            .AsQueryable();

        var reviews = await query
            .OrderByDescending(x => x.CreateAt)
            .ToListAsync();

        return reviews.Select(x => new ReviewManagementDto
        {
            Id = x.Id,
            ProductId = x.ProductId,
            ProductName = x.Product?.Name,
            ProductImage = x.Product?.Images?.FirstOrDefault()?.ImageUrl,
            UserId = x.UserId,
            Email = x.User?.Email,
            Avatar = x.User?.Profile?.Avatar,
            Rating = x.Rating,
            Comment = x.Comment,
            CreatedAt = x.CreateAt,
            HasImages = x.Images.Any(),
            HasReply = x.Reply != null,
            ReplyContent = x.Reply?.Reply,
            ReplyCreatedAt = x.Reply?.CreatedAt,
            Images = x.Images.Select(i => i.ImageUrl).ToList()
        }).ToList();
    }

    public async Task<Review?> GetByIdAsync(long id)
    {
        return await _context.Reviews
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Review?> GetUserReviewAsync(
    long productId,
    long userId,
    long orderId)
    {
        return await _context.Reviews
            .FirstOrDefaultAsync(x =>
                x.ProductId == productId &&
                x.UserId == userId &&
                x.OrderId == orderId
            );
    }

    public async Task setIsReview(long orderId, long productId)
    {
        var orderItem = await _context.OrderItems
       .FirstOrDefaultAsync(x =>
           x.OrderId == orderId &&
           x.ProductId == productId
       );

        if (orderItem != null)
        {
            orderItem.IsReview = true;
        }

        await _context.SaveChangesAsync();
    }


    public async Task AddAsync(
        List<ReviewImage> images,
        Review review)
    {
        // save review trước
        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        // lúc này review.Id đã có
        foreach (var image in images)
        {
            image.ReviewId = review.Id;
        }

        _context.ReviewImages.AddRange(images);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Review review)
    {
        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Review review)
    {
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }

    public async Task<double> GetAverageRatingAsync(long productId)
    {
        var avg = await _context.Reviews
            .Where(x => x.ProductId == productId)
            .AverageAsync(x => (double?)x.Rating);

        return avg ?? 0;
    }

    public async Task<int> GetTotalReviewsAsync(long productId)
    {
        return await _context.Reviews
            .CountAsync(x => x.ProductId == productId);
    }

    public async Task<List<ReviewManagementDto>> GetAllAsync(
        long? productId = null,
        int? rating = null,
        bool? hasImages = null,
        bool? noReply = null,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Reviews
            .Include(x => x.Product)
                .ThenInclude(x => x.Images)
            .Include(x => x.User)
                .ThenInclude(x => x.Profile)
            .Include(x => x.Images)
            .Include(x => x.Reply)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(x => x.ProductId == productId.Value);

        if (rating.HasValue)
            query = query.Where(x => x.Rating == rating.Value);

        if (hasImages.HasValue)
            query = hasImages.Value
                ? query.Where(x => x.Images.Any())
                : query.Where(x => !x.Images.Any());

        if (noReply.HasValue && noReply.Value)
            query = query.Where(x => x.Reply == null);

        var reviews = await query
            .OrderByDescending(x => x.CreateAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return reviews.Select(x => new ReviewManagementDto
        {
            Id = x.Id,
            ProductId = x.ProductId,
            ProductName = x.Product?.Name,
            ProductImage = x.Product?.Images?.FirstOrDefault()?.ImageUrl,
            UserId = x.UserId,
            Email = x.User?.Email,
            Avatar = x.User?.Profile?.Avatar,
            Rating = x.Rating,
            Comment = x.Comment,
            CreatedAt = x.CreateAt,
            HasImages = x.Images.Any(),
            HasReply = x.Reply != null,
            ReplyContent = x.Reply?.Reply,
            ReplyCreatedAt = x.Reply?.CreatedAt,
            Images = x.Images.Select(i => i.ImageUrl).ToList()
        }).ToList();
    }

    public async Task<ReviewStatisticsDto> GetStatisticsAsync(long? productId = null)
    {
        var query = _context.Reviews.AsQueryable();

        if (productId.HasValue)
            query = query.Where(x => x.ProductId == productId.Value);

        var total = await query.CountAsync();
        var avg = await query.AverageAsync(x => (double?)x.Rating) ?? 0;

        var ratingCount = new Dictionary<int, int>();
        for (int i = 1; i <= 5; i++)
        {
            var count = await query.CountAsync(x => x.Rating == i);
            ratingCount[i] = count;
        }

        var withImages = await query.CountAsync(x => x.Images.Any());
        var noReply = await query.CountAsync(x => x.Reply == null);

        return new ReviewStatisticsDto
        {
            TotalReviews = total,
            AverageRating = Math.Round(avg, 1),
            RatingCount = ratingCount,
            ReviewsWithImages = withImages,
            ReviewsWithoutReply = noReply
        };
    }

    public async Task<ReviewReply?> GetReplyByReviewIdAsync(long reviewId)
    {
        return await _context.ReviewReplies
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.ReviewId == reviewId);
    }

    public async Task AddReplyAsync(ReviewReply reply)
    {
        _context.ReviewReplies.Add(reply);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateReplyAsync(ReviewReply reply)
    {
        reply.UpdatedAt = DateTime.Now;
        _context.ReviewReplies.Update(reply);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteReplyAsync(long replyId)
    {
        var reply = await _context.ReviewReplies.FindAsync(replyId);
        if (reply != null)
        {
            _context.ReviewReplies.Remove(reply);
            await _context.SaveChangesAsync();
        }
    }
}

public interface IReviewRepository
{
    Task<List<ReviewManagementDto>> GetByProductIdAsync(long productId);

    Task<Review?> GetByIdAsync(long id);
    Task setIsReview(long orderId, long productId);

    Task<Review?> GetUserReviewAsync(long productId, long userId, long orderId);

    Task AddAsync(List<ReviewImage> image, Review review);
    Task UpdateAsync(Review review);

    Task DeleteAsync(Review review);

    Task<double> GetAverageRatingAsync(long productId);

    Task<int> GetTotalReviewsAsync(long productId);

    Task<List<ReviewManagementDto>> GetAllAsync(
        long? productId = null,
        int? rating = null,
        bool? hasImages = null,
        bool? noReply = null,
        int page = 1,
        int pageSize = 10);

    Task<ReviewStatisticsDto> GetStatisticsAsync(long? productId = null);

    Task<ReviewReply?> GetReplyByReviewIdAsync(long reviewId);

    Task AddReplyAsync(ReviewReply reply);

    Task UpdateReplyAsync(ReviewReply reply);

    Task DeleteReplyAsync(long replyId);
}
