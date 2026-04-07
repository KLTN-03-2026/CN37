public class Role
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime CreateAt { get; set; }

    public ICollection<UserRole> UserRoles { get; set; }
}