using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Infrastructure.Data;
using ChatApp.Messaging.Infrastructure.Repositories;
using ChatApp.Messaging.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace ChatApp.Messaging.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<MessagingDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(MessagingDbContext).Assembly.FullName)
            )
        );

        // Unit of Work and Repositories
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Redis
        var redisConnection = configuration.GetConnectionString("Redis");
        services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnection!));
        services.AddSingleton<IMessageBroker, RedisMessageBroker>();

        return services;
    }
}