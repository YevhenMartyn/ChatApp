using System.Text.Json;
using ChatApp.RealTime.Application.Hubs;
using ChatApp.RealTime.Application.Interfaces;
using ChatApp.RealTime.Application.Models;
using ChatApp.RealTime.Domain.Events;
using ChatApp.RealTime.Domain.Interfaces;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ChatApp.RealTime.Infrastructure.BackgroundServices;

public sealed class RedisEventListenerService : BackgroundService
{
    private readonly IRedisSubscriber _redisSubscriber;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly ILogger<RedisEventListenerService> _logger;
    private const string Channel = "chatapp.updates";

    public RedisEventListenerService(
        IRedisSubscriber redisSubscriber,
        IHubContext<ChatHub, IChatClient> hubContext,
        ILogger<RedisEventListenerService> logger)
    {
        _redisSubscriber = redisSubscriber;
        _hubContext = hubContext;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("RedisEventListenerService starting...");

        try
        {
            await _redisSubscriber.SubscribeAsync(Channel, HandleMessageAsync, stoppingToken);
            
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("RedisEventListenerService is stopping.");
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "RedisEventListenerService encountered a critical error");
            throw;
        }
    }

    private async Task HandleMessageAsync(string message)
    {
        try
        {
            var messageSentEvent = JsonSerializer.Deserialize<MessageSentEvent>(message);
            
            if (messageSentEvent is null)
            {
                _logger.LogWarning("Failed to deserialize message: {Message}", message);
                return;
            }

            _logger.LogInformation(
                "Broadcasting message {MessageId} to conversation {ConversationId}",
                messageSentEvent.Id,
                messageSentEvent.ConversationId);

            var messageResponse = messageSentEvent.Adapt<MessageResponse>();

            await _hubContext.Clients
                .Group(messageSentEvent.ConversationId.ToString())
                .ReceiveMessage(messageResponse);

            _logger.LogInformation(
                "Successfully broadcast message {MessageId}",
                messageSentEvent.Id);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error deserializing Redis message: {Message}", message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting message to SignalR clients");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("RedisEventListenerService stopping...");
        
        await _redisSubscriber.UnsubscribeAsync(Channel, cancellationToken);
        await base.StopAsync(cancellationToken);
    }
}