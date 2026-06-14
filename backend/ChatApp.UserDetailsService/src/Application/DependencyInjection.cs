using ChatApp.UserDetailsService.Application.Services;
using ChatApp.UserDetailsService.Application.Validators;
using FluentValidation;
using Mapster;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApp.UserDetailsService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();

        // Validators
        services.AddValidatorsFromAssemblyContaining<UpdateUserProfileValidator>();

        // Mapster configuration
        TypeAdapterConfig.GlobalSettings.Scan(typeof(DependencyInjection).Assembly);

        return services;
    }
}