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
}
