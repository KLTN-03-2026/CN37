public interface IUserAddressService
{
    Task<List<UserAddress>> GetAddressesAsync(long userId);
    Task<UserAddress> AddAddressAsync(long userId, UserAddressDto dto);
    Task<bool> UpdateAddressAsync(long id, UserAddressDto dto);
    Task<bool> DeleteAddressAsync(long id);
    Task<bool> SetDefaultAddressAsync(long id);
}