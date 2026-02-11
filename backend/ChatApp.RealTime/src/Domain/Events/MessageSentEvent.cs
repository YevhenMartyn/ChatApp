namespace ChatApp.RealTime.Domain.Events;

public sealed class MessageSentEvent
{
    public required Guid Id { get; init; }
    public required Guid ConversationId { get; init; }
    public required string SenderId { get; init; } 
    public required string Content { get; init; }
    public required DateTime SentAt { get; init; }
}