using ChatApp.UserDetailsService.Domain.Entities;

namespace ChatApp.UserDetailsService.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<UserProfile?> GetByIdAsync(Guid id);
    Task<UserProfile?> GetByUsernameAsync(string username);
    Task<IEnumerable<UserProfile>> GetMultipleByIdsAsync(IEnumerable<Guid> ids);
    Task<IEnumerable<UserProfile>> SearchByDisplayNameAsync(string query);
    Task AddAsync(UserProfile userProfile);
    Task UpdateAsync(UserProfile userProfile);
    Task DeleteAsync(Guid id);
}