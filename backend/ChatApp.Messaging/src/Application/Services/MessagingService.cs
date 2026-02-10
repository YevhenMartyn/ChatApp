using ChatApp.Messaging.Application.DTOs;
using ChatApp.Messaging.Application.Interfaces;
using ChatApp.Messaging.Domain.Entities;
using MapsterMapper;

namespace ChatApp.Messaging.Application.Services;

public class MessagingService : IMessagingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMessageBroker _messageBroker;
    private readonly IMapper _mapper;

    public MessagingService(IUnitOfWork unitOfWork, IMessageBroker messageBroker, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _messageBroker = messageBroker;
        _mapper = mapper;
    }

    public async Task<ConversationResponse> StartConversationAsync(string currentUserId, string otherUserId, CancellationToken cancellationToken = default)
    {
        var existingConversation = await _unitOfWork.Conversations.GetByParticipantsAsync(currentUserId, otherUserId, cancellationToken);

        if (existingConversation != null)
        {
            return _mapper.Map<ConversationResponse>(existingConversation);
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

        return _mapper.Map<ConversationResponse>(conversation);
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

        var messageEvent = new MessageSentEvent(message.Id, conversationId, currentUserId, content, message.SentAt);
        await _messageBroker.PublishAsync("chatapp.updates", messageEvent, cancellationToken);

        return _mapper.Map<MessageResponse>(message);
    }

    public async Task<List<MessageResponse>> GetConversationHistoryAsync(string currentUserId, Guid conversationId, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var isParticipant = await _unitOfWork.Messages.IsUserParticipantAsync(conversationId, currentUserId, cancellationToken);

        if (!isParticipant)
        {
            throw new UnauthorizedAccessException("You are not a participant in this conversation");
        }

        var messages = await _unitOfWork.Messages.GetByConversationAsync(conversationId, page, pageSize, cancellationToken);
        return _mapper.Map<List<MessageResponse>>(messages);
    }

    public async Task<List<ConversationResponse>> GetMyConversationsAsync(string currentUserId, CancellationToken cancellationToken = default)
    {
        var conversations = await _unitOfWork.Conversations.GetUserConversationsAsync(currentUserId, cancellationToken);
        return _mapper.Map<List<ConversationResponse>>(conversations);
    }
}