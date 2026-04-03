using Microsoft.EntityFrameworkCore;
public class UserAddressService : IUserAddressService
{
    private readonly AppDbContext _context;

    public UserAddressService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserAddress>> GetAddressesAsync(long userId)
    {
        return await _context.UserAddresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<UserAddress> AddAddressAsync(long userId, UserAddressDto dto)
    {
        if (dto.IsDefault)
        {
            var existingDefaults = await _context.UserAddresses
                .Where(a => a.UserId == userId && a.IsDefault)
                .ToListAsync();
            existingDefaults.ForEach(a => a.IsDefault = false);
        }

        var address = new UserAddress
        {
            UserId = userId,
            ReceiverName = dto.ReceiverName,
            ReceiverPhone = dto.Phone,
            Province = dto.Province,
            District = dto.District,
            Ward = dto.Ward,
            Street = dto.AddressDetail,
            IsDefault = dto.IsDefault
        };

        _context.UserAddresses.Add(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task<bool> UpdateAddressAsync(long id, UserAddressDto dto)
    {
        var address = await _context.UserAddresses.FindAsync(id);
        if (address == null) return false;

        if (dto.IsDefault && !address.IsDefault)
        {
            var existingDefaults = await _context.UserAddresses
                .Where(a => a.UserId == address.UserId && a.IsDefault)
                .ToListAsync();
            existingDefaults.ForEach(a => a.IsDefault = false);
        }

        address.ReceiverName = dto.ReceiverName;
        address.ReceiverPhone = dto.Phone;
        address.Province = dto.Province;
        address.District = dto.District;
        address.Ward = dto.Ward;
        address.Street = dto.AddressDetail;
        address.IsDefault = dto.IsDefault;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAddressAsync(long id)
    {
        var address = await _context.UserAddresses.FindAsync(id);
        if (address == null) return false;

        _context.UserAddresses.Remove(address);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetDefaultAddressAsync(long id)
    {
        var address = await _context.UserAddresses.FindAsync(id);
        if (address == null) return false;

        var existingDefaults = await _context.UserAddresses
            .Where(a => a.UserId == address.UserId && a.IsDefault)
            .ToListAsync();

        existingDefaults.ForEach(a => a.IsDefault = false);

        address.IsDefault = true;
        await _context.SaveChangesAsync();
        return true;
    }
}