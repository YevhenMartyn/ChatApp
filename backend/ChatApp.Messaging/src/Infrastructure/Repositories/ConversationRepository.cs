using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Domain.Entities;
using ChatApp.Messaging.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Messaging.Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly MessagingDbContext _context;

    public ConversationRepository(MessagingDbContext context)
    {
        _context = context;
    }

    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<Conversation?> GetByParticipantsAsync(string userId1, string userId2, CancellationToken cancellationToken = default)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .Where(c => c.Participants.Any(p => p.UserId == userId1) &&
                       c.Participants.Any(p => p.UserId == userId2) &&
                       c.Participants.Count == 2)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Conversation>> GetUserConversationsAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Conversation> AddAsync(Conversation conversation, CancellationToken cancellationToken = default)
    {
        await _context.Conversations.AddAsync(conversation, cancellationToken);
        return conversation;
    }

    public Task UpdateAsync(Conversation conversation, CancellationToken cancellationToken = default)
    {
        _context.Conversations.Update(conversation);
        return Task.CompletedTask;
    }
}