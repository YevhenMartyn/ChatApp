namespace ChatApp.Messaging.Application.DTOs;

public record ConversationResponse(
    Guid Id,
    DateTime CreatedAt,
    DateTime LastMessageAt,
    List<string> ParticipantIds,
    MessageResponse? LastMessage
);