using ChatApp.Messaging.Application.DTOs;

namespace ChatApp.Messaging.Application.Interfaces;

public interface IMessagingService
{
    Task<ConversationResponse> StartConversationAsync(string currentUserId, string otherUserId, CancellationToken cancellationToken = default);
    Task<MessageResponse> SendMessageAsync(string currentUserId, Guid conversationId, string content, CancellationToken cancellationToken = default);
    Task<List<MessageResponse>> GetConversationHistoryAsync(string currentUserId, Guid conversationId, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<List<ConversationResponse>> GetMyConversationsAsync(string currentUserId, CancellationToken cancellationToken = default);
}