using ChatApp.UserDetailsService.Infrastructure.Data;
using ChatApp.UserDetailsService.Infrastructure.Events;
using ChatApp.UserDetailsService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace ChatApp.UserDetailsService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<UserDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        var redisConnection = configuration.GetConnectionString("Redis");
        services.AddSingleton<IConnectionMultiplexer>(
            ConnectionMultiplexer.Connect(redisConnection ?? "localhost:6379"));

        services.AddScoped<IUserRepository, UserRepository>();

        services.AddHostedService<RedisEventListener>();

        return services;
    }
}