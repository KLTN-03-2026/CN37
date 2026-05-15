    public class ReviewImage
    {
        public long Id { get; set; }

        public long ReviewId { get; set; }

        public string ImageUrl { get; set; }

        public Review Review { get; set; }
    }
