namespace ChatApp.Messaging.Application.DTOs;

public record MessageSentEvent(
    Guid Id,
    Guid ConversationId,
    string SenderId,
    string Content,
    DateTime SentAt
);