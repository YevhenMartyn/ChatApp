namespace ChatApp.UserDetailsService.Domain.Events;

public class UserRegisteredEvent
{
    public string UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}