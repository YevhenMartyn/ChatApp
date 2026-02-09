using ChatApp.Messaging.Domain.Entities;

namespace ChatApp.Messaging.Application.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Conversation?> GetByParticipantsAsync(string userId1, string userId2, CancellationToken cancellationToken = default);
    Task<List<Conversation>> GetUserConversationsAsync(string userId, CancellationToken cancellationToken = default);
    Task<Conversation> AddAsync(Conversation conversation, CancellationToken cancellationToken = default);
    Task UpdateAsync(Conversation conversation, CancellationToken cancellationToken = default);
}