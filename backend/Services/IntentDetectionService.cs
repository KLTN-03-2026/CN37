public class IntentDetectionService
    : IIntentDetectionService
{
    private readonly List<string> _keywords =
    [
        "máy lạnh",
        "điều hòa",
        "tivi",
        "tv",
        "máy giặt",
        "tủ lạnh",
        "camera",
        "nồi cơm",
        "quạt",
        "lọc không khí",
        "giá",
        "bao nhiêu",
        "khuyến mãi",
        "giảm giá",
        "mua",
        "sản phẩm",
        "công nghệ",
        "casper",
        "daikin",
        "comfee",
        "toshiba",
        "sharp",
        "midea"
    ];

    public bool IsProductRelated(
        string message)
    {
        message = message.ToLower();

        return _keywords.Any(k =>
            message.Contains(k));
    }
}