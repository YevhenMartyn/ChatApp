using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Application.Mappings;
using ChatApp.Messaging.Application.Services;
using ChatApp.Messaging.Application.Validators;
using FluentValidation;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ChatApp.Messaging.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IMessagingService, MessagingService>();
        services.AddValidatorsFromAssemblyContaining<SendMessageValidator>();
        
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(Assembly.GetExecutingAssembly());
        MappingConfig.RegisterMappings();
        
        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();
        
        return services;
    }
}