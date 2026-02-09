namespace ChatApp.Messaging.Application.DTOs;

public record SendMessageRequest(
    Guid ConversationId,
    string Content
);