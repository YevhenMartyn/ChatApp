using ChatApp.Messaging.Application.DTOs;
using FluentValidation;

namespace ChatApp.Messaging.Application.Validators;

public class StartConversationValidator : AbstractValidator<StartConversationRequest>
{
    public StartConversationValidator()
    {
        RuleFor(x => x.OtherUserId)
            .NotEmpty()
            .WithMessage("OtherUserId is required");
    }
}