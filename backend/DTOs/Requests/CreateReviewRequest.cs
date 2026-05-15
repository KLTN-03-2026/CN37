public class CreateReviewDto
{

    public long ProductId { get; set; }
    public long OrderId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public List<IFormFile>? Images { get; set; }
}
