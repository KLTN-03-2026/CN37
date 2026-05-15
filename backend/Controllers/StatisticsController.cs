using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Statistics;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles="ADMIN")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    /// <summary>
    /// Get dashboard summary with KPIs
    /// GET /api/statistics/dashboard
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        try
        {
            var dashboard = await _statisticsService.GetDashboardSummaryAsync();
            return Ok(new
            {
                success = true,
                data = dashboard,
                message = "Dashboard summary retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving dashboard: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get revenue statistics by type (daily/weekly/monthly/quarterly/yearly)
    /// GET /api/statistics/revenue?type=daily&fromDate=2026-01-01&toDate=2026-12-31
    /// </summary>
    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueStatistics(
        [FromQuery] string type = "daily",
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var result = await _statisticsService.GetRevenueStatisticsAsync(type, fromDate, toDate);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Revenue statistics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving revenue statistics: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get profit statistics by type (daily/weekly/monthly/quarterly/yearly)
    /// GET /api/statistics/profit?type=monthly&fromDate=2026-01-01&toDate=2026-12-31
    /// </summary>
    [HttpGet("profit")]
    public async Task<IActionResult> GetProfitStatistics(
        [FromQuery] string type = "daily",
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var result = await _statisticsService.GetProfitStatisticsAsync(type, fromDate, toDate);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Profit statistics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving profit statistics: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get import cost statistics by type (daily/weekly/monthly/quarterly/yearly)
    /// GET /api/statistics/import-cost?type=monthly&fromDate=2026-01-01&toDate=2026-12-31
    /// </summary>
    [HttpGet("import-cost")]
    public async Task<IActionResult> GetImportCostStatistics(
        [FromQuery] string type = "daily",
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var result = await _statisticsService.GetImportCostStatisticsAsync(type, fromDate, toDate);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Import cost statistics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving import cost statistics: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get product analytics with pagination
    /// GET /api/statistics/products?pageNumber=1&pageSize=50
    /// </summary>
    [HttpGet("products")]
    public async Task<IActionResult> GetProductAnalytics(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest(new
                {
                    success = false,
                    message = "Page number and page size must be greater than 0"
                });

            var result = await _statisticsService.GetProductAnalyticsAsync(pageNumber, pageSize);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Product analytics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving product analytics: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get product analytics by ID
    /// GET /api/statistics/products/{productId}
    /// </summary>
    [HttpGet("products/{productId}")]
    public async Task<IActionResult> GetProductAnalyticsById(long productId)
    {
        try
        {
            var result = await _statisticsService.GetProductAnalyticsByIdAsync(productId);
            if (result == null)
                return NotFound(new
                {
                    success = false,
                    message = "Product not found"
                });

            return Ok(new
            {
                success = true,
                data = result,
                message = "Product analytics retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving product analytics: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get top selling products
    /// GET /api/statistics/top-selling?topCount=10
    /// </summary>
    [HttpGet("top-selling")]
    public async Task<IActionResult> GetTopSellingProducts([FromQuery] int topCount = 10)
    {
        try
        {
            if (topCount < 1 || topCount > 100)
                return BadRequest(new
                {
                    success = false,
                    message = "Top count must be between 1 and 100"
                });

            var result = await _statisticsService.GetTopSellingProductsAsync(topCount);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Top selling products retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving top selling products: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get top profit products
    /// GET /api/statistics/top-profit-products?topCount=10
    /// </summary>
    [HttpGet("top-profit-products")]
    public async Task<IActionResult> GetTopProfitProducts([FromQuery] int topCount = 10)
    {
        try
        {
            if (topCount < 1 || topCount > 100)
                return BadRequest(new
                {
                    success = false,
                    message = "Top count must be between 1 and 100"
                });

            var result = await _statisticsService.GetTopProfitProductsAsync(topCount);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Top profit products retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving top profit products: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get revenue by category
    /// GET /api/statistics/category-revenue?fromDate=2026-01-01&toDate=2026-12-31
    /// </summary>
    [HttpGet("category-revenue")]
    public async Task<IActionResult> GetRevenuByCategory(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var result = await _statisticsService.GetRevenueByCategoryAsync(fromDate, toDate);
            return Ok(new
            {
                success = true,
                data = result,
                message = "Category revenue retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving category revenue: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Compare current month vs previous month
    /// GET /api/statistics/comparison/month
    /// </summary>
    [HttpGet("comparison/month")]
    public async Task<IActionResult> CompareCurrentVsPreviousMonth()
    {
        try
        {
            var result = await _statisticsService.CompareCurrentVsPreviousMonthAsync();
            return Ok(new
            {
                success = true,
                data = result,
                message = "Month comparison retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving month comparison: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Compare current year vs previous year (monthly breakdown)
    /// GET /api/statistics/comparison/year
    /// </summary>
    [HttpGet("comparison/year")]
    public async Task<IActionResult> CompareCurrentVsPreviousYear()
    {
        try
        {
            var result = await _statisticsService.CompareCurrentVsPreviousYearAsync();
            return Ok(new
            {
                success = true,
                data = result,
                message = "Year comparison retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving year comparison: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get KPI cards
    /// GET /api/statistics/kpi-cards
    /// </summary>
    [HttpGet("kpi-cards")]
    public async Task<IActionResult> GetKpiCards()
    {
        try
        {
            var result = await _statisticsService.GetKpiCardsAsync();
            return Ok(new
            {
                success = true,
                data = result,
                message = "KPI cards retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error retrieving KPI cards: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Export statistics to Excel
    /// POST /api/statistics/export/excel
    /// </summary>
    [HttpPost("export/excel")]
    public async Task<IActionResult> ExportToExcel([FromBody] ExportStatisticsRequestDto request)
    {
        try
        {
            var fileContent = await _statisticsService.ExportStatisticsToExcelAsync(request);
            return File(fileContent, 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"statistics_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
        }
        catch (NotImplementedException)
        {
            return BadRequest(new
            {
                success = false,
                message = "Excel export is not yet implemented. Please install EPPlus NuGet package."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error exporting to Excel: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Export statistics to PDF
    /// POST /api/statistics/export/pdf
    /// </summary>
    [HttpPost("export/pdf")]
    public async Task<IActionResult> ExportToPdf([FromBody] ExportStatisticsRequestDto request)
    {
        try
        {
            var fileContent = await _statisticsService.ExportStatisticsToPdfAsync(request);
            return File(fileContent, 
                "application/pdf",
                $"statistics_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
        }
        catch (NotImplementedException)
        {
            return BadRequest(new
            {
                success = false,
                message = "PDF export is not yet implemented. Please install iTextSharp NuGet package."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error exporting to PDF: {ex.Message}"
            });
        }
    }
}
