using ChatApp.RealTime.Domain.Interfaces;
using ChatApp.RealTime.Infrastructure.BackgroundServices;
using ChatApp.RealTime.Infrastructure.Redis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace ChatApp.RealTime.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis") 
            ?? throw new InvalidOperationException("Redis connection string is not configured");

        services.AddSingleton<IConnectionMultiplexer>(sp =>
            ConnectionMultiplexer.Connect(redisConnection));

        services.AddSingleton<IRedisSubscriber, RedisSubscriber>();
        services.AddHostedService<RedisEventListenerService>();

        return services;
    }
}