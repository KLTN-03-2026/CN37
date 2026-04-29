public interface IRoleService
{
    Task<List<RoleDto>> GetAllRolesAsync();
}