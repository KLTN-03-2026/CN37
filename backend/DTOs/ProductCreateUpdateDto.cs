public class ProductCreateUpdateDto
{
    public string Name { get; set; }
    public long CategoryId { get; set; }
    public string Brand { get; set; }
    public string Description { get; set; }

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    public List<SpecDto> Specifications { get; set; }

    // ảnh mới upload
    public List<IFormFile> Images { get; set; }

    // xóa ảnh cũ
    public List<long> DeletedImageIds { get; set; }
}