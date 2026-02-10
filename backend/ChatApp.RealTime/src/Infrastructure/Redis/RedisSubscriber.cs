using ChatApp.RealTime.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace ChatApp.RealTime.Infrastructure.Redis;

public sealed class RedisSubscriber : IRedisSubscriber, IAsyncDisposable
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisSubscriber> _logger;
    private ISubscriber? _subscriber;

    public RedisSubscriber(IConnectionMultiplexer redis, ILogger<RedisSubscriber> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task SubscribeAsync(string channel, Func<string, Task> messageHandler, CancellationToken cancellationToken = default)
    {
        try
        {
            _subscriber = _redis.GetSubscriber();
            
            await _subscriber.SubscribeAsync(
                new RedisChannel(channel, RedisChannel.PatternMode.Literal),
                async (redisChannel, value) =>
                {
                    if (!value.HasValue) return;
                    
                    try
                    {
                        await messageHandler(value.ToString());
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error handling message from Redis channel {Channel}", channel);
                    }
                });

            _logger.LogInformation("Successfully subscribed to Redis channel: {Channel}", channel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to subscribe to Redis channel: {Channel}", channel);
            throw;
        }
    }

    public async Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default)
    {
        if (_subscriber is not null)
        {
            await _subscriber.UnsubscribeAsync(new RedisChannel(channel, RedisChannel.PatternMode.Literal));
            _logger.LogInformation("Unsubscribed from Redis channel: {Channel}", channel);
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_subscriber is not null)
        {
            await _subscriber.UnsubscribeAllAsync();
        }
    }
}