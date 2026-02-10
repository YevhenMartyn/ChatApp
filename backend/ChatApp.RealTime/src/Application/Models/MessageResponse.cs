namespace ChatApp.RealTime.Application.Models;

public sealed class MessageResponse
{
    public required Guid MessageId { get; init; }
    public required Guid ConversationId { get; init; }
    public required Guid SenderId { get; init; }
    public required string SenderName { get; init; }
    public required string Content { get; init; }
    public required DateTime SentAt { get; init; }
}