using ChatApp.UserDetailsService.Application.Services;
using ChatApp.UserDetailsService.Domain.Events;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Text.Json;

namespace ChatApp.UserDetailsService.Infrastructure.Events;

public class RedisEventListener : IHostedService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IUserService _userService;
    private readonly ILogger<RedisEventListener> _logger;
    private ISubscriber? _subscriber;

    public RedisEventListener(
        IConnectionMultiplexer redis,
        IUserService userService,
        ILogger<RedisEventListener> logger)
    {
        _redis = redis;
        _userService = userService;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _subscriber = _redis.GetSubscriber();

        await _subscriber.SubscribeAsync("user-registered", async (channel, message) =>
        {
            try
            {
                if (message.IsNull)
                {
                    _logger.LogWarning("Received null message on {Channel}", channel);
                    return;
                }

                var eventData = JsonSerializer.Deserialize<UserRegisteredEvent>(message.ToString());
                if (eventData == null)
                {
                    _logger.LogWarning("Failed to deserialize UserRegisteredEvent");
                    return;
                }

                await _userService.CreateUserProfileAsync(eventData.UserId, eventData.Username);
                _logger.LogInformation(
                    "User profile created for userId: {UserId}, username: {Username}",
                    eventData.UserId,
                    eventData.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing UserRegisteredEvent");
            }
        });

        _logger.LogInformation("Redis event listener started");
        await Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_subscriber != null)
        {
            await _subscriber.UnsubscribeAllAsync();
        }
        _logger.LogInformation("Redis event listener stopped");
    }
}