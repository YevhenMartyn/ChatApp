using ChatApp.UserDetailsService.Domain.Entities;
using ChatApp.UserDetailsService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.UserDetailsService.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserDbContext _context;

    public UserRepository(UserDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile?> GetByIdAsync(Guid id)
    {
        return await _context.UserProfiles.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<UserProfile?> GetByUsernameAsync(string username)
    {
        return await _context.UserProfiles
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<IEnumerable<UserProfile>> GetMultipleByIdsAsync(IEnumerable<Guid> ids)
    {
        var idList = ids.ToList();
        return await _context.UserProfiles
            .Where(u => idList.Contains(u.Id))
            .ToListAsync();
    }

    public async Task<IEnumerable<UserProfile>> SearchByDisplayNameAsync(string query)
    {
        return await _context.UserProfiles
            .Where(u => u.DisplayName.Contains(query))
            .OrderBy(u => u.DisplayName)
            .Take(50)
            .ToListAsync();
    }

    public async Task AddAsync(UserProfile userProfile)
    {
        await _context.UserProfiles.AddAsync(userProfile);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserProfile userProfile)
    {
        _context.UserProfiles.Update(userProfile);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.UserProfiles.FirstOrDefaultAsync(u => u.Id == id);
        if (user != null)
        {
            _context.UserProfiles.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}