using ChatApp.UserDetailsService.Application.DTOs;

namespace ChatApp.UserDetailsService.Application.Services;

public interface IUserService
{
    Task<UserProfileDto?> GetUserProfileAsync(string userId);
    Task<UserProfileDto?> GetUserProfileByUsernameAsync(string username);
    Task<IEnumerable<UserProfileDto>> GetMultipleUserProfilesAsync(IEnumerable<string> userIds);
    Task<IEnumerable<UserProfileDto>> SearchUsersAsync(string query);
    Task<UserProfileDto> UpdateUserProfileAsync(string userId, UpdateUserProfileRequest request);
    Task CreateUserProfileAsync(string userId, string username);
}