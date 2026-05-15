using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProductId(long productId)
    {
        var reviews = await _reviewService
            .GetByProductIdAsync(productId);

        var avg = await _reviewService
            .GetAverageRatingAsync(productId);

        var total = await _reviewService
            .GetTotalReviewsAsync(productId);

        return Ok(new
        {
            averageRating = Math.Round(avg, 1),
            totalReviews = total,
            reviews
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var userId = Convert.ToInt64(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        await _reviewService.CreateAsync(userId, dto, baseUrl);

        return Ok(new
        {
            message = "Đánh giá thành công"
        });
    }

    // [Authorize]
    // [HttpPut("{id}")]
    // public async Task<IActionResult> Update(
    //     long id,
    //     UpdateReviewDto dto)
    // {
    //     var userId = Convert.ToInt64(
    //         User.FindFirst(ClaimTypes.NameIdentifier)?.Value
    //     );

    //     await _reviewService.UpdateAsync(id, userId, dto);

    //     return Ok(new
    //     {
    //         message = "Cập nhật review thành công"
    //     });
    // }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var userId = Convert.ToInt64(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        await _reviewService.DeleteAsync(id, userId);

        return Ok(new
        {
            message = "Xóa review thành công"
        });
    }

    // ============= MANAGEMENT ENDPOINTS =============

    [Authorize]
    [HttpGet("management/all")]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? productId = null,
        [FromQuery] int? rating = null,
        [FromQuery] bool? hasImages = null,
        [FromQuery] bool? noReply = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var reviews = await _reviewService.GetAllReviewsAsync(
            productId, rating, hasImages, noReply, page, pageSize);

        return Ok(new
        {
            data = reviews,
            page,
            pageSize
        });
    }

    [Authorize]
    [HttpGet("management/statistics")]
    public async Task<IActionResult> GetStatistics(
        [FromQuery] long? productId = null)
    {
        var stats = await _reviewService.GetReviewStatisticsAsync(productId);
        return Ok(stats);
    }

    [Authorize]
    [HttpPost("management/reply")]
    public async Task<IActionResult> AddReply([FromBody] ReviewReplyDto dto)
    {
        var userId = Convert.ToInt64(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        await _reviewService.AddReplyAsync(userId, dto);

        return Ok(new
        {
            message = "Trả lời thành công"
        });
    }

    [Authorize]
    [HttpPut("management/reply/{replyId}")]
    public async Task<IActionResult> UpdateReply(
        long replyId,
        [FromBody] ReviewReplyDto dto)
    {
        var userId = Convert.ToInt64(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        await _reviewService.UpdateReplyAsync(userId, replyId, dto);

        return Ok(new
        {
            message = "Cập nhật câu trả lời thành công"
        });
    }

    [Authorize]
    [HttpDelete("management/reply/{replyId}")]
    public async Task<IActionResult> DeleteReply(long replyId)
    {
        var userId = Convert.ToInt64(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        await _reviewService.DeleteReplyAsync(userId, replyId);

        return Ok(new
        {
            message = "Xóa câu trả lời thành công"
        });
    }

}

