using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Domain.Entities;
using ChatApp.Messaging.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Messaging.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly MessagingDbContext _context;

    public MessageRepository(MessagingDbContext context)
    {
        _context = context;
    }

    public async Task<Message> AddAsync(Message message, CancellationToken cancellationToken = default)
    {
        await _context.Messages.AddAsync(message, cancellationToken);
        return message;
    }

    public async Task<List<Message>> GetByConversationAsync(Guid conversationId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Reverse()
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsUserParticipantAsync(Guid conversationId, string userId, CancellationToken cancellationToken = default)
    {
        return await _context.ConversationParticipants
            .AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId, cancellationToken);
    }
}