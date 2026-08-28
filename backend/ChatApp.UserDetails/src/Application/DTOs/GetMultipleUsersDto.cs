namespace ChatApp.UserDetailsService.Application.DTOs;

public class GetMultipleUsersRequest
{
    public IEnumerable<string> Ids { get; set; } = new List<string>();
}