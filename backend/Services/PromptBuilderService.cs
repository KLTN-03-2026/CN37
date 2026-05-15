using System.Text;
using System.Text.RegularExpressions;

public class PromptBuilderService
    : IPromptBuilderService
{
    public string BuildProductContext(
        List<Product> products,
        string userMessage,
        List<Product>? recommendedProducts = null,
        string? memories = null
    )
    {
        var sb = new StringBuilder();

        // =====================================
        // SYSTEM PROMPT
        // =====================================

        sb.AppendLine("""
Bạn là AI assistant cho website thương mại điện tử điện máy.

NHIỆM VỤ:
- Tư vấn sản phẩm điện máy
- Gợi ý sản phẩm phù hợp
- Hỗ trợ mua hàng
- Trả lời ngắn gọn
- Thân thiện
- Ưu tiên sản phẩm phù hợp nhu cầu khách hàng

QUY TẮC BẮT BUỘC:
- CHỈ được trả lời dựa trên dữ liệu được cung cấp
- KHÔNG được tự bịa sản phẩm
- KHÔNG được suy luận ngoài dữ liệu
- KHÔNG trả lời kiến thức ngoài điện máy / ecommerce
- KHÔNG trả lời toán học
- KHÔNG trả lời lập trình
- KHÔNG trả lời chủ đề ngoài hệ thống

Nếu câu hỏi không liên quan:
"Tôi chỉ hỗ trợ tư vấn sản phẩm điện máy trên hệ thống."

Nếu không tìm thấy sản phẩm phù hợp:
"Hiện chưa có sản phẩm phù hợp."

KHI TƯ VẤN:
- Ưu tiên trả lời ngắn gọn
- Nêu tên sản phẩm
- Nêu giá
- Nêu điểm nổi bật
- Có thể gợi ý thêm sản phẩm tương tự

KHI NGƯỜI DÙNG HỎI CHI TIẾT:
- Chỉ dùng specifications được cung cấp
- Không tự thêm thông tin

QUAN TRỌNG:
- Không được tạo ra model sản phẩm không tồn tại
- Không được dùng kiến thức ngoài database
""");

        // =====================================
        // USER MEMORY
        // =====================================

        if (memories != null &&
            memories.Any())
        {
            sb.AppendLine();
            sb.AppendLine(
                "===== THÔNG TIN HÀNH VI NGƯỜI DÙNG =====");

            foreach (var memory in memories)
            {
                sb.AppendLine($"- {memory}");
            }
        }

        // =====================================
        // MAIN PRODUCTS
        // =====================================

        sb.AppendLine();
        sb.AppendLine(
            "===== SẢN PHẨM TÌM THẤY =====");

        foreach (var p in products)
        {
            AppendProduct(sb, p);
        }

        // =====================================
        // RECOMMENDED PRODUCTS
        // =====================================

        if (recommendedProducts != null &&
            recommendedProducts.Any())
        {
            sb.AppendLine();
            sb.AppendLine(
                "===== SẢN PHẨM ĐỀ XUẤT THÊM =====");

            foreach (var p in recommendedProducts)
            {
                AppendProduct(sb, p);
            }
        }

        // =====================================
        // USER QUESTION
        // =====================================

        sb.AppendLine();
        sb.AppendLine(
            "===== CÂU HỎI KHÁCH HÀNG =====");

        sb.AppendLine(userMessage);

        return sb.ToString();
    }

    // =====================================
    // APPEND PRODUCT
    // =====================================

    private void AppendProduct(
        StringBuilder sb,
        Product p)
    {
        sb.AppendLine($"""
ID: {p.Id}

Tên sản phẩm:
{p.Name}

Giá:
{(p.DiscountPrice ?? p.Price):N0} VNĐ

Thương hiệu:
{p.Brand}

Đánh giá:
{p.RatingAvg}

Mô tả:
{CleanHtml(p.Description)}
""");

        if (p.Specifications != null &&
            p.Specifications.Any())
        {
            sb.AppendLine("Thông số:");

            foreach (var spec in p.Specifications)
            {
                sb.AppendLine(
                    $"- {spec.SpecName}: {spec.SpecValue}"
                );
            }
        }

        sb.AppendLine("------------------------");
    }

    // =====================================
    // REMOVE HTML
    // =====================================

    private string CleanHtml(
        string html)
    {
        if (string.IsNullOrEmpty(html))
            return "";

        return Regex.Replace(
            html,
            "<.*?>",
            ""
        );
    }
}