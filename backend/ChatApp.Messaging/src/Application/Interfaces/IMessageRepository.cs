using ChatApp.Messaging.Domain.Entities;

namespace ChatApp.Messaging.Application.Interfaces;

public interface IMessageRepository
{
    Task<Message> AddAsync(Message message, CancellationToken cancellationToken = default);
    Task<List<Message>> GetByConversationAsync(Guid conversationId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<bool> IsUserParticipantAsync(Guid conversationId, string userId, CancellationToken cancellationToken = default);
}