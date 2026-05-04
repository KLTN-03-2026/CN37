public class Supplier
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

    public bool IsActive { get; set;} = true;
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public long? CreatedBy { get; set; }

    public User? CreatedByUser { get; set; }

    public ICollection<InventoryImport> Imports { get; set; } = new List<InventoryImport>();
}