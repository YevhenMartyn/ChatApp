namespace ChatApp.Messaging.Application.Interfaces;

public interface IUnitOfWork
{
    IConversationRepository Conversations { get; }
    IMessageRepository Messages { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}