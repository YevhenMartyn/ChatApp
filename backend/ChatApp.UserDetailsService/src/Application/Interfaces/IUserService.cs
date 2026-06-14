using ChatApp.UserDetailsService.Application.DTOs;

namespace ChatApp.UserDetailsService.Application.Services;

public interface IUserService
{
    Task<UserProfileDto?> GetUserProfileAsync(Guid userId);
    Task<UserProfileDto?> GetUserProfileByUsernameAsync(string username);
    Task<IEnumerable<UserProfileDto>> GetMultipleUserProfilesAsync(IEnumerable<Guid> userIds);
    Task<IEnumerable<UserProfileDto>> SearchUsersAsync(string query);
    Task<UserProfileDto> UpdateUserProfileAsync(Guid userId, UpdateUserProfileRequest request);
    Task CreateUserProfileAsync(Guid userId, string username);
}