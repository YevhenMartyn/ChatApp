using ChatApp.UserDetailsService.Application.DTOs;
using ChatApp.UserDetailsService.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.UserDetailsService.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetUserById(Guid id)
    {
        var userProfile = await _userService.GetUserProfileAsync(id);
        if (userProfile == null)
        {
            _logger.LogWarning("User profile not found for ID: {UserId}", id);
            return NotFound(new { message = "User profile not found." });
        }

        return Ok(userProfile);
    }

    [Authorize]
    [HttpGet("by-username/{username}")]
    public async Task<ActionResult<UserProfileDto>> GetUserByUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return BadRequest(new { message = "Username is required." });
        }

        var userProfile = await _userService.GetUserProfileByUsernameAsync(username.Trim());
        if (userProfile == null)
        {
            _logger.LogWarning("User profile not found for username: {Username}", username);
            return NotFound(new { message = "User profile not found." });
        }

        return Ok(userProfile);
    }

    [Authorize]
    [HttpPost("by-ids")]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetMultipleUsersById([FromBody] GetMultipleUsersRequest request)
    {
        if (request?.Ids == null || !request.Ids.Any())
        {
            return BadRequest(new { message = "At least one user ID is required." });
        }

        var userProfiles = await _userService.GetMultipleUserProfilesAsync(request.Ids);
        return Ok(userProfiles);
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> SearchUsers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { message = "Search query is required." });
        }

        var results = await _userService.SearchUsersAsync(query.Trim());
        return Ok(results);
    }


    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateMyProfile(UpdateUserProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            _logger.LogWarning("Invalid user ID in token");
            return Unauthorized(new { message = "Invalid authentication token." });
        }

        try
        {
            var updatedProfile = await _userService.UpdateUserProfileAsync(userId, request);
            return Ok(updatedProfile);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User profile not found for ID: {UserId}", userId);
            return NotFound(new { message = ex.Message });
        }
        catch (FluentValidation.ValidationException ex)
        {
            var errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage });
            return BadRequest(new { message = "Validation failed.", errors });
        }
    }
}