using ChatApp.UserDetailsService.Application.DTOs;
using ChatApp.UserDetailsService.Domain.Entities;
using ChatApp.UserDetailsService.Infrastructure.Repositories;
using FluentValidation;
using Mapster;

namespace ChatApp.UserDetailsService.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IValidator<UpdateUserProfileRequest> _updateValidator;

    public UserService(IUserRepository userRepository, IValidator<UpdateUserProfileRequest> updateValidator)
    {
        _userRepository = userRepository;
        _updateValidator = updateValidator;
    }

    public async Task<UserProfileDto?> GetUserProfileAsync(string userId)
    {
        var userProfile = await _userRepository.GetByIdAsync(userId);
        return userProfile?.Adapt<UserProfileDto>();
    }

    public async Task<UserProfileDto?> GetUserProfileByUsernameAsync(string username)
    {
        var userProfile = await _userRepository.GetByUsernameAsync(username);
        return userProfile?.Adapt<UserProfileDto>();
    }

    public async Task<IEnumerable<UserProfileDto>> GetMultipleUserProfilesAsync(IEnumerable<string> userIds)
    {
        var userProfiles = await _userRepository.GetMultipleByIdsAsync(userIds);
        return userProfiles.Adapt<List<UserProfileDto>>();
    }

    public async Task<IEnumerable<UserProfileDto>> SearchUsersAsync(string query)
    {
        var users = await _userRepository.SearchByDisplayNameAsync(query);
        return users.Adapt<List<UserProfileDto>>();
    }

    public async Task<UserProfileDto> UpdateUserProfileAsync(string userId, UpdateUserProfileRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var userProfile = await _userRepository.GetByIdAsync(userId);
        if (userProfile == null)
        {
            throw new KeyNotFoundException($"User profile with ID {userId} not found.");
        }

        userProfile.DisplayName = request.DisplayName;
        userProfile.AvatarUrl = request.AvatarUrl;
        userProfile.Bio = request.Bio;
        userProfile.Email = request.Email;
        userProfile.MobilePhone = request.MobilePhone;
        userProfile.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(userProfile);
        return userProfile.Adapt<UserProfileDto>();
    }

    public async Task CreateUserProfileAsync(string userId, string username)
    {
        var existingUser = await _userRepository.GetByIdAsync(userId);
        if (existingUser != null)
        {
            return; 
        }

        var userProfile = new UserProfile
        {
            Id = userId,
            Username = username,
            DisplayName = username,
            AvatarUrl = null,
            Bio = null,
            Email = null,
            MobilePhone = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(userProfile);
    }
}