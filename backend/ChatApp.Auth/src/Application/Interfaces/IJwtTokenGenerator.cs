using ChatApp.Auth.Domain.Entities;

namespace Application.Interfaces;

public interface IJwtTokenGenerator
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}