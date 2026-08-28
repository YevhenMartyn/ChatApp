using FluentValidation;
using ChatApp.UserDetailsService.Application.DTOs;

namespace ChatApp.UserDetailsService.Application.Validators;

public class UpdateUserProfileValidator : AbstractValidator<UpdateUserProfileRequest>
{
    public UpdateUserProfileValidator()
    {
        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Display name is required.")
            .Length(1, 100).WithMessage("Display name must be between 1 and 100 characters.");

        RuleFor(x => x.AvatarUrl)
            .Must(uri => uri == null || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Avatar URL must be a valid URI.");

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Bio must not exceed 500 characters.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Email must be a valid email address.")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.MobilePhone)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Mobile phone must be a valid phone number.")
            .When(x => !string.IsNullOrEmpty(x.MobilePhone));
    }
}