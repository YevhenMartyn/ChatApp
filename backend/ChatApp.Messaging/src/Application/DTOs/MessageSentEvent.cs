namespace ChatApp.Messaging.Application.DTOs;

public record MessageSentEvent(
    Guid ConversationId,
    string SenderId,
    string Content,
    DateTime Timestamp
);