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

        services.AddValidatorsFromAssemblyContaining<UpdateUserProfileValidator>();

        TypeAdapterConfig.GlobalSettings.Scan(typeof(DependencyInjection).Assembly);

        return services;
    }
}