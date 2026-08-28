namespace ChatApp.UserDetailsService.Application.DTOs;

public class UpdateUserProfileRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? Email { get; set; }
    public string? MobilePhone { get; set; }
}