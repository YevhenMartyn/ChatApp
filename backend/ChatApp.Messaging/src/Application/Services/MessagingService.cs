using ChatApp.Messaging.Application.DTOs;
using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Domain.Entities;

namespace ChatApp.Messaging.Application.Services;

public class MessagingService : IMessagingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMessageBroker _messageBroker;

    public MessagingService(IUnitOfWork unitOfWork, IMessageBroker messageBroker)
    {
        _unitOfWork = unitOfWork;
        _messageBroker = messageBroker;
    }

    public async Task<ConversationResponse> StartConversationAsync(string currentUserId, string otherUserId, CancellationToken cancellationToken = default)
    {
        var existingConversation = await _unitOfWork.Conversations.GetByParticipantsAsync(currentUserId, otherUserId, cancellationToken);

        if (existingConversation != null)
        {
            return MapToConversationResponse(existingConversation);
        }

        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            LastMessageAt = DateTime.UtcNow,
            Participants = new List<ConversationParticipant>
            {
                new() { UserId = currentUserId },
                new() { UserId = otherUserId }
            }
        };

        await _unitOfWork.Conversations.AddAsync(conversation, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToConversationResponse(conversation);
    }

    public async Task<MessageResponse> SendMessageAsync(string currentUserId, Guid conversationId, string content, CancellationToken cancellationToken = default)
    {
        var isParticipant = await _unitOfWork.Messages.IsUserParticipantAsync(conversationId, currentUserId, cancellationToken);

        if (!isParticipant)
        {
            throw new UnauthorizedAccessException("You are not a participant in this conversation");
        }

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderId = currentUserId,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        await _unitOfWork.Messages.AddAsync(message, cancellationToken);

        var conversation = await _unitOfWork.Conversations.GetByIdAsync(conversationId, cancellationToken);
        if (conversation != null)
        {
            conversation.LastMessageAt = message.SentAt;
            await _unitOfWork.Conversations.UpdateAsync(conversation, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var messageEvent = new MessageSentEvent(conversationId, currentUserId, content, message.SentAt);
        await _messageBroker.PublishAsync("chatapp.updates", messageEvent, cancellationToken);

        return new MessageResponse(message.Id, message.ConversationId, message.SenderId, message.Content, message.SentAt);
    }

    public async Task<List<MessageResponse>> GetConversationHistoryAsync(string currentUserId, Guid conversationId, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var isParticipant = await _unitOfWork.Messages.IsUserParticipantAsync(conversationId, currentUserId, cancellationToken);

        if (!isParticipant)
        {
            throw new UnauthorizedAccessException("You are not a participant in this conversation");
        }

        var messages = await _unitOfWork.Messages.GetByConversationAsync(conversationId, page, pageSize, cancellationToken);
        return messages.Select(m => new MessageResponse(m.Id, m.ConversationId, m.SenderId, m.Content, m.SentAt)).ToList();
    }

    public async Task<List<ConversationResponse>> GetMyConversationsAsync(string currentUserId, CancellationToken cancellationToken = default)
    {
        var conversations = await _unitOfWork.Conversations.GetUserConversationsAsync(currentUserId, cancellationToken);
        return conversations.Select(MapToConversationResponse).ToList();
    }

    private static ConversationResponse MapToConversationResponse(Conversation conversation)
    {
        var lastMessage = conversation.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
        var lastMessageResponse = lastMessage != null
            ? new MessageResponse(lastMessage.Id, lastMessage.ConversationId, lastMessage.SenderId, lastMessage.Content, lastMessage.SentAt)
            : null;

        return new ConversationResponse(
            conversation.Id,
            conversation.CreatedAt,
            conversation.LastMessageAt,
            conversation.Participants.Select(p => p.UserId).ToList(),
            lastMessageResponse
        );
    }
}