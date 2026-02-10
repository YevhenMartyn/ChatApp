using ChatApp.RealTime.Application.Models;

namespace ChatApp.RealTime.Application.Interfaces;

public interface IChatClient
{
    Task ReceiveMessage(MessageResponse message);
    Task MessageDeleted(Guid messageId, Guid conversationId);
    Task MessageUpdated(MessageResponse message);
}