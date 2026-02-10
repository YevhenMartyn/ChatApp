namespace ChatApp.Messaging.Application.DTOs;

public record MessageSentEvent(
    Guid MessageId,
    Guid ConversationId,
    string SenderId,
    string Content,
    DateTime SentAt
);