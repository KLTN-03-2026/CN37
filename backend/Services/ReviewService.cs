public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IWebHostEnvironment _env;
    private readonly IOrderRepository _orderRepository;

    public ReviewService(IReviewRepository reviewRepository, IWebHostEnvironment env, IOrderRepository orderRepository)
    {
        _reviewRepository = reviewRepository;
        _env = env;
        _orderRepository = orderRepository;
    }

    public async Task<List<ReviewManagementDto>> GetByProductIdAsync(long productId)
    {
        return await _reviewRepository.GetByProductIdAsync(productId);
    }

    public async Task CreateAsync(long userId, CreateReviewDto dto, string baseUrl)
    {
        var purchased = await _orderRepository.HasPurchasedProductAsync(userId, dto.ProductId);
        if (!purchased)
        {
            throw new Exception(
                "Bạn cần mua sản phẩm trước khi đánh giá"
            );
        }
        var existed = await _reviewRepository
        .GetUserReviewAsync(
            dto.ProductId,
            userId,
            dto.OrderId
        );

        if (existed != null)
        {
            throw new Exception("Bạn đã đánh giá sản phẩm này rồi");
        }

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            OrderId = dto.OrderId
        };

        if (dto.Images != null && dto.Images.Any())
        {
            var images = new List<ReviewImage>();

            foreach (var file in dto.Images)
            {
                var url = await SaveFile(file, baseUrl);

                images.Add(new ReviewImage
                {
                    ReviewId = review.Id,
                    ImageUrl = url,

                });
            }

            await _reviewRepository.AddAsync(images, review);
            await _reviewRepository.setIsReview(dto.OrderId, dto.ProductId);
        }
    }

    // public async Task UpdateAsync(long reviewId, long userId, UpdateReviewDto dto)
    // {
    //     var review = await _reviewRepository.GetByIdAsync(reviewId);

    //     if (review == null)
    //     {
    //         throw new Exception("Review không tồn tại");
    //     }

    //     if (review.UserId != userId)
    //     {
    //         throw new Exception("Không có quyền sửa review");
    //     }

    //     review.Rating = dto.Rating;
    //     review.Comment = dto.Comment;

    //     await _reviewRepository.UpdateAsync(review);
    // }

    public async Task DeleteAsync(long reviewId, long userId)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
        {
            throw new Exception("Review không tồn tại");
        }

        if (review.UserId != userId)
        {
            throw new Exception("Không có quyền xóa review");
        }

        await _reviewRepository.DeleteAsync(review);
    }

    public async Task<double> GetAverageRatingAsync(long productId)
    {
        return await _reviewRepository.GetAverageRatingAsync(productId);
    }

    public async Task<int> GetTotalReviewsAsync(long productId)
    {
        return await _reviewRepository.GetTotalReviewsAsync(productId);
    }

    private async Task<string> SaveFile(IFormFile file, string baseUrl)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty");

        // fallback nếu null
        var rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        var folder = Path.Combine(rootPath, "uploads");

        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"{baseUrl}/uploads/{fileName}";
    }

    // ============= MANAGEMENT METHODS =============

    public async Task<List<ReviewManagementDto>> GetAllReviewsAsync(
        long? productId = null,
        int? rating = null,
        bool? hasImages = null,
        bool? noReply = null,
        int page = 1,
        int pageSize = 10)
    {
        return await _reviewRepository.GetAllAsync(
            productId, rating, hasImages, noReply, page, pageSize);
    }

    public async Task<ReviewStatisticsDto> GetReviewStatisticsAsync(long? productId = null)
    {
        return await _reviewRepository.GetStatisticsAsync(productId);
    }

    public async Task AddReplyAsync(long userId, ReviewReplyDto dto)
    {
        var review = await _reviewRepository.GetByIdAsync(dto.ReviewId);
        if (review == null)
            throw new Exception("Review không tồn tại");

        var existingReply = await _reviewRepository.GetReplyByReviewIdAsync(dto.ReviewId);
        if (existingReply != null)
            throw new Exception("Đánh giá này đã có câu trả lời");

        var reply = new ReviewReply
        {
            ReviewId = dto.ReviewId,
            UserId = userId,
            Reply = dto.Reply
        };

        await _reviewRepository.AddReplyAsync(reply);
    }

    public async Task UpdateReplyAsync(long userId, long replyId, ReviewReplyDto dto)
    {
        var reply = await _reviewRepository.GetReplyByReviewIdAsync(dto.ReviewId);
        if (reply == null)
            throw new Exception("Câu trả lời không tồn tại");

        if (reply.UserId != userId)
            throw new Exception("Không có quyền cập nhật câu trả lời");

        reply.Reply = dto.Reply;
        await _reviewRepository.UpdateReplyAsync(reply);
    }

    public async Task DeleteReplyAsync(long userId, long replyId)
    {
        var reply = await _reviewRepository.GetReplyByReviewIdAsync(replyId);
        if (reply == null)
            throw new Exception("Câu trả lời không tồn tại");

        if (reply.UserId != userId)
            throw new Exception("Không có quyền xóa câu trả lời");

        await _reviewRepository.DeleteReplyAsync(replyId);
    }
}

