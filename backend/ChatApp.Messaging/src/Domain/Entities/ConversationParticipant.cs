namespace ChatApp.Messaging.Domain.Entities;

public class ConversationParticipant
{
    public Guid ConversationId { get; set; }
    public string UserId { get; set; } = string.Empty;
    
    public Conversation Conversation { get; set; } = null!;
}