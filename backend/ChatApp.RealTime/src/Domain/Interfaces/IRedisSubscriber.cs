namespace ChatApp.RealTime.Domain.Interfaces;

public interface IRedisSubscriber
{
    Task SubscribeAsync(string channel, Func<string, Task> messageHandler, CancellationToken cancellationToken = default);
    Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default);
}