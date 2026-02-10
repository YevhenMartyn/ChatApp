using ChatApp.Messaging.Application.DTOs;
using ChatApp.Messaging.Domain.Entities;
using Mapster;

namespace ChatApp.Messaging.Application.Mappings;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        // Message -> MessageResponse
        TypeAdapterConfig<Message, MessageResponse>
            .NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.ConversationId, src => src.ConversationId)
            .Map(dest => dest.SenderId, src => src.SenderId)
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.SentAt, src => src.SentAt);

        // Conversation -> ConversationResponse 
        TypeAdapterConfig<Conversation, ConversationResponse>
            .NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.LastMessageAt, src => src.LastMessageAt)
            .Map(dest => dest.ParticipantIds, src => src.Participants.Select(p => p.UserId).ToList())
            .Map(dest => dest.LastMessage, src => src.Messages
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefault())
            .AfterMapping((src, dest) =>
            {
                if (dest.LastMessage != null)
                {
                    var lastMsg = src.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
                    if (lastMsg != null)
                    {
                        dest = dest with
                        {
                            LastMessage = new MessageResponse(
                                lastMsg.Id,
                                lastMsg.ConversationId,
                                lastMsg.SenderId,
                                lastMsg.Content,
                                lastMsg.SentAt
                            )
                        };
                    }
                }
            });
    }
}