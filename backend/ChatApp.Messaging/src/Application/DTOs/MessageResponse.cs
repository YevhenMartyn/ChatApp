namespace ChatApp.Messaging.Application.DTOs;

public record MessageResponse(
    Guid Id,
    Guid ConversationId,
    string SenderId,
    string Content,
    DateTime SentAt
);