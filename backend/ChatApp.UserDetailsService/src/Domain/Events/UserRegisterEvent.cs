namespace ChatApp.UserDetailsService.Domain.Events;

public class UserRegisteredEvent
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}