public class ReviewStatisticsDto
{
    public int TotalReviews { get; set; }

    public double AverageRating { get; set; }

    public Dictionary<int, int> RatingCount { get; set; } = new();

    public int ReviewsWithImages { get; set; }

    public int ReviewsWithoutReply { get; set; }
}
