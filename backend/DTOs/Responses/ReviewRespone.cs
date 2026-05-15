public class ReviewResponseDto
    {
        public long Id { get; set; }

        public long ProductId { get; set; }

        public long UserId { get; set; }

        public string Email { get; set; }

        public string? Avatar { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }
        public bool VerifiedPurchase { get; set; }
        public List<string> Images { get; set; }

        public DateTime CreateAt { get; set; }
    }