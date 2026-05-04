public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; }
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }

    public PagedResult(IEnumerable<T> items, int total, int page, int pageSize)
    {
        Items = items;
        Total = total;
        Page = page;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling((double)total / pageSize);
    }
}