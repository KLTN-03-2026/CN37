public class UserDto
{
    public long Id { get; set; }
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public bool EmailVerified { get; set; }
    public string FullName { get; set; }
    public string Phone { get; set; }
    public IEnumerable<string> Roles { get; set; }
    public bool IsDeleted { get; set; }
    public string AvatarUrl { get; set; }
}