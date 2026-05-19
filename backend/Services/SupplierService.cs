using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

public class SupplierService : ISupplierService
{
    private readonly AppDbContext _context;
    private readonly IAuditService _audit;

    public SupplierService(AppDbContext context, IAuditService audit)
    {
        _context = context;
        _audit = audit;
    }

    public async Task<SupplierDto> CreateSupplierAsync(CreateSupplierRequest request, long adminId, string ip)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new Exception("Tên nhà cung cấp là bắt buộc");

        if (string.IsNullOrWhiteSpace(request.Code))
            request.Code = $"SUP{DateTime.Now.Ticks % 10000000}";

        var exists = await _context.Suppliers.AnyAsync(s => s.Code == request.Code);
        if (exists) throw new Exception("Mã nhà cung cấp đã tồn tại");

        var supplier = new Supplier
        {
            Code = request.Code.ToUpper(),
            Name = request.Name.Trim(),
            ContactPerson = request.ContactPerson?.Trim(),
            Phone = request.Phone?.Trim(),
            Email = request.Email?.Trim().ToLowerInvariant(),
            Address = request.Address?.Trim(),
            Province = request.Province?.Trim(),
            District = request.District?.Trim(),
            TaxCode = request.TaxCode?.Trim(),
            BankName = request.BankName?.Trim(),
            BankAccount = request.BankAccount?.Trim(),
            Note = request.Note?.Trim(),
            IsActive = true,
            CreatedBy = adminId,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, supplier.Id, "CreateSupplier",
            $"Created supplier {supplier.Name}", ip);

        return await GetSupplierAsync(supplier.Id);
    }

    public async Task<SupplierDto> UpdateSupplierAsync(long supplierId, UpdateSupplierRequest request, long adminId, string ip)
    {
        var supplier = await _context.Suppliers.FindAsync(supplierId);
        if (supplier == null) throw new Exception("Nhà cung cấp không tồn tại");

        if (!string.IsNullOrWhiteSpace(request.Name))
            supplier.Name = request.Name.Trim();

        if (!string.IsNullOrWhiteSpace(request.ContactPerson))
            supplier.ContactPerson = request.ContactPerson.Trim();

        if (!string.IsNullOrWhiteSpace(request.Phone))
            supplier.Phone = request.Phone.Trim();

        if (!string.IsNullOrWhiteSpace(request.Email))
            supplier.Email = request.Email.Trim().ToLowerInvariant();

        if (!string.IsNullOrWhiteSpace(request.Address))
            supplier.Address = request.Address.Trim();

        if (!string.IsNullOrWhiteSpace(request.Province))
            supplier.Province = request.Province.Trim();

        if (!string.IsNullOrWhiteSpace(request.District))
            supplier.District = request.District.Trim();

        if (!string.IsNullOrWhiteSpace(request.TaxCode))
            supplier.TaxCode = request.TaxCode.Trim();

        if (!string.IsNullOrWhiteSpace(request.BankName))
            supplier.BankName = request.BankName.Trim();

        if (!string.IsNullOrWhiteSpace(request.BankAccount))
            supplier.BankAccount = request.BankAccount.Trim();

        if (!string.IsNullOrWhiteSpace(request.Note))
            supplier.Note = request.Note.Trim();

        supplier.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, supplierId, "UpdateSupplier",
            $"Updated supplier {supplier.Name}", ip);

        return await GetSupplierAsync(supplierId);
    }

    public async Task<SupplierDto> GetSupplierAsync(long supplierId)
    {
        var supplier = await _context.Suppliers.FindAsync(supplierId);
        if (supplier == null)
            throw new Exception("Nhà cung cấp không tồn tại");
        return new SupplierDto
        {
            Id = supplier.Id,
            Code = supplier.Code,
            Name = supplier.Name,
            ContactPerson = supplier.ContactPerson,
            Phone = supplier.Phone,
            Email = supplier.Email,
            Address = supplier.Address,
            Province = supplier.Province,
            District = supplier.District,
            TaxCode = supplier.TaxCode,
            BankName = supplier.BankName,
            BankAccount = supplier.BankAccount,
            IsActive = supplier.IsActive,
            Note = supplier.Note,
            CreatedAt = supplier.CreatedAt,
            UpdatedAt = supplier.UpdatedAt,
            CreatedBy = supplier.CreatedBy
        };
    }

    // public async Task<List<SupplierDto>> GetAllSupplierAsync()
    // {
    //     var suppliers = await _context.Suppliers
    //         .Where(s => s.IsActive == true)
    //         .ToListAsync();

    //     if (suppliers == null || !suppliers.Any())
    //         return new List<SupplierDto>();

    //     return suppliers.Select(s => new SupplierDto
    //     {
    //         Id = s.Id,
    //         Code = s.Code,
    //         Name = s.Name,
    //         ContactPerson = s.ContactPerson,
    //         Phone = s.Phone,
    //         Email = s.Email,
    //         Address = s.Address,
    //         Province = s.Province,
    //         District = s.District,
    //         TaxCode = s.TaxCode,
    //         BankName = s.BankName,
    //         BankAccount = s.BankAccount,
    //         IsActive = s.IsActive,
    //         Note = s.Note,
    //         CreatedAt = s.CreatedAt,
    //         UpdatedAt = s.UpdatedAt,
    //         CreatedBy = s.CreatedBy
    //     }).ToList();
    // }

    public async Task<PagedResult<SupplierDto>> SearchSuppliersAsync(SupplierSearchParams p)
    {
        var query = _context.Suppliers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var search = p.Search.ToLower().Trim();
            query = query.Where(s => s.Name.ToLower().Contains(search) ||
                                     s.Code.ToLower().Contains(search) ||
                                     s.Phone.Contains(search) ||
                                     s.Email.ToLower().Contains(search));
        }

        var total = await query.CountAsync();

        var suppliers = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((p.Page - 1) * p.PageSize)
            .Take(p.PageSize)
            .Select(s => new SupplierDto
            {
                Id = s.Id,
                Code = s.Code,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                Province = s.Province,
                District = s.District,
                TaxCode = s.TaxCode,
                BankName = s.BankName,
                BankAccount = s.BankAccount,
                IsActive = s.IsActive,
                Note = s.Note,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                CreatedBy = s.CreatedBy
            })
            .ToListAsync();

        return new PagedResult<SupplierDto>(
            suppliers,
            total,
            p.Page,
            p.PageSize
        )
        {
            Total = (int)Math.Ceiling(total / (double)p.PageSize)
        };
    }

    public async Task DeleteSupplierAsync(long supplierId, long adminId, string ip)
    {
        var supplier = await _context.Suppliers.FindAsync(supplierId);
        if (supplier == null) throw new Exception("Nhà cung cấp không tồn tại");

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, supplierId, "DeleteSupplier",
            $"Deleted supplier {supplier.Name}", ip);
    }

    public async Task<SupplierDto> ToggleSupplierStatusAsync(long supplierId, long adminId, string ip)
    {
        var supplier = await _context.Suppliers.FindAsync(supplierId);
        if (supplier == null) throw new Exception("Nhà cung cấp không tồn tại");

        supplier.IsActive = supplier.IsActive == true ? false : true;
        supplier.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(adminId, supplierId, "ToggleSupplierStatus",
            $"Changed supplier status to {supplier.IsActive}", ip);

        return await GetSupplierAsync(supplierId);
    }
    public async Task<byte[]> ExportSuppliersExcelAsync()
    {
        var suppliers = await _context.Suppliers
            .OrderByDescending(s => s.Id)
            .Select(s => new
            {
                s.Code,
                s.Name,
                s.ContactPerson,
                s.Phone,
                s.Email,
                s.Address,
                s.Province,
                s.District,
                s.TaxCode,
                s.BankName,
                s.BankAccount,
                s.Note,
                s.CreatedAt,
                s.UpdatedAt
            })
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Nhà cung cấp");

        worksheet.Range("A1:N1").Merge();
        worksheet.Cell("A1").Value = "DANH SÁCH NHÀ CUNG CẤP";
        worksheet.Cell("A1").Style.Font.Bold = true;
        worksheet.Cell("A1").Style.Font.FontSize = 20;
        worksheet.Cell("A1").Style.Font.FontColor = XLColor.White;
        worksheet.Cell("A1").Style.Fill.BackgroundColor = XLColor.DarkGreen;
        worksheet.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        worksheet.Range("A2:N2").Merge();
        worksheet.Cell("A2").Value = $"Ngày xuất: {DateTime.Now:dd/MM/yyyy HH:mm}";
        worksheet.Cell("A2").Style.Font.Italic = true;
        worksheet.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

        int headerRow = 4;

        string[] headers =
        {
            "STT",
            "Mã NCC",
            "Tên nhà cung cấp",
            "Người liên hệ",
            "Số điện thoại",
            "Email",
            "Địa chỉ",
            "Tỉnh/Thành",
            "Quận/Huyện",
            "Mã số thuế",
            "Ngân hàng",
            "Số tài khoản",
            "Ghi chú",
            "Ngày tạo"
        };

        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cell(headerRow, i + 1).Value = headers[i];
        }

        var headerRange = worksheet.Range($"A{headerRow}:N{headerRow}");
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Font.FontColor = XLColor.White;
        headerRange.Style.Fill.BackgroundColor = XLColor.Green;
        headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        int row = headerRow + 1;
        int stt = 1;

        foreach (var item in suppliers)
        {
            worksheet.Cell(row, 1).Value = stt++;
            worksheet.Cell(row, 2).Value = item.Code ?? "N/A";
            worksheet.Cell(row, 3).Value = item.Name ?? "N/A";
            worksheet.Cell(row, 4).Value = item.ContactPerson ?? "N/A";
            worksheet.Cell(row, 5).Value = item.Phone ?? "N/A";
            worksheet.Cell(row, 6).Value = item.Email ?? "N/A";
            worksheet.Cell(row, 7).Value = item.Address ?? "N/A";
            worksheet.Cell(row, 8).Value = item.Province ?? "N/A";
            worksheet.Cell(row, 9).Value = item.District ?? "N/A";
            worksheet.Cell(row, 10).Value = item.TaxCode ?? "N/A";
            worksheet.Cell(row, 11).Value = item.BankName ?? "N/A";
            worksheet.Cell(row, 12).Value = item.BankAccount ?? "N/A";
            worksheet.Cell(row, 13).Value = item.Note ?? "";
            worksheet.Cell(row, 14).Value = item.CreatedAt.ToString("dd/MM/yyyy HH:mm");

            var dataRange = worksheet.Range($"A{row}:N{row}");
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            if (row % 2 == 0)
            {
                dataRange.Style.Fill.BackgroundColor = XLColor.LightGray;
            }

            row++;
        }

        worksheet.Columns().AdjustToContents();

        worksheet.Column(1).Width = 8;
        worksheet.Column(3).Width = 30;
        worksheet.Column(6).Width = 30;
        worksheet.Column(7).Width = 35;
        worksheet.Column(13).Width = 35;
        worksheet.Column(14).Width = 22;

        worksheet.Column(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        worksheet.Column(14).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        worksheet.SheetView.FreezeRows(headerRow);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return stream.ToArray();
    }
}
