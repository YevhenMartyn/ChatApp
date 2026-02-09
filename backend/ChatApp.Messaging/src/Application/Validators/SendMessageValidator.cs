using ChatApp.Messaging.Application.DTOs;
using FluentValidation;

namespace ChatApp.Messaging.Application.Validators;

public class SendMessageValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("ConversationId is required");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Message content cannot be empty")
            .MaximumLength(5000)
            .WithMessage("Message content cannot exceed 5000 characters");
    }
}