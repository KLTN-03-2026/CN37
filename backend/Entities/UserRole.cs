using System.ComponentModel.DataAnnotations.Schema;

public class UserRole
{
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; }

    [Column("role_id")]
    public long RoleId { get; set; }
    public Role Role { get; set; }
}