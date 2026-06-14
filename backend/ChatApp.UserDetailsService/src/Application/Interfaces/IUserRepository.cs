using ChatApp.UserDetailsService.Domain.Entities;

namespace ChatApp.UserDetailsService.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<UserProfile?> GetByIdAsync(string id);
    Task<UserProfile?> GetByUsernameAsync(string username);
    Task<IEnumerable<UserProfile>> GetMultipleByIdsAsync(IEnumerable<string> ids);
    Task<IEnumerable<UserProfile>> SearchByDisplayNameAsync(string query);
    Task AddAsync(UserProfile userProfile);
    Task UpdateAsync(UserProfile userProfile);
    Task DeleteAsync(string id);
}