using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Infrastructure.Data;

namespace ChatApp.Messaging.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly MessagingDbContext _context;
    private IConversationRepository? _conversations;
    private IMessageRepository? _messages;

    public UnitOfWork(MessagingDbContext context)
    {
        _context = context;
    }

    public IConversationRepository Conversations => _conversations ??= new ConversationRepository(_context);
    public IMessageRepository Messages => _messages ??= new MessageRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}