using ChatApp.Messaging.Application.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace ChatApp.Messaging.Infrastructure.Services;

public class RedisMessageBroker : IMessageBroker
{
    private readonly IConnectionMultiplexer _redis;

    public RedisMessageBroker(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task PublishAsync<T>(string channel, T message, CancellationToken cancellationToken = default)
    {
        var subscriber = _redis.GetSubscriber();
        var json = JsonSerializer.Serialize(message);
        await subscriber.PublishAsync(RedisChannel.Literal(channel), json);
    }
}