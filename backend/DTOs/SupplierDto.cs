public class SupplierDto
{
    public long Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? ContactPerson { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Province { get; set; }
    public string? District { get; set; }
    public string? TaxCode { get; set; }
    public string? BankName { get; set; }
    public string? BankAccount { get; set; }
    public bool IsActive{ get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public long? CreatedBy { get; set; }
}

public class CreateSupplierRequest
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string? ContactPerson { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Province { get; set; }
    public string? District { get; set; }
    public string? TaxCode { get; set; }
    public string? BankName { get; set; }
    public string? BankAccount { get; set; }
    public string? Note { get; set; }
}

public class UpdateSupplierRequest
{
    public string? Name { get; set; }
    public string? ContactPerson { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Province { get; set; }
    public string? District { get; set; }
    public string? TaxCode { get; set; }
    public string? BankName { get; set; }
    public string? BankAccount { get; set; }
    public string? Note { get; set; }
}

public class SupplierSearchParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
}
