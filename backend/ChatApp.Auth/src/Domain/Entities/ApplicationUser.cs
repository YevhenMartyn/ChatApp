using Microsoft.AspNetCore.Identity;

namespace ChatApp.Auth.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } 
    public bool IsActive { get; set; } = true;
}