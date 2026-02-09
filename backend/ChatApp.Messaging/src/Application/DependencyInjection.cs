using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Application.Services;
using ChatApp.Messaging.Application.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApp.Messaging.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IMessagingService, MessagingService>();
        services.AddValidatorsFromAssemblyContaining<SendMessageValidator>();
        
        return services;
    }
}