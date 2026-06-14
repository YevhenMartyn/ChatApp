namespace ChatApp.UserDetailsService.Application.DTOs;

public class GetMultipleUsersRequest
{
    public IEnumerable<Guid> Ids { get; set; } = new List<Guid>();
}