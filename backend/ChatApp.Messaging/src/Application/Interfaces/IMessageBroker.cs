namespace ChatApp.Messaging.Application.Interfaces;

public interface IMessageBroker
{
    Task PublishAsync<T>(string channel, T message, CancellationToken cancellationToken = default);
}