using FluentValidation;

namespace ChatApp.UserDetailsService.Application.Validators;

public class UserSearchValidator : AbstractValidator<string>
{
    public UserSearchValidator()
    {
        RuleFor(x => x)
            .NotEmpty().WithMessage("Search query is required.")
            .Length(1, 100).WithMessage("Search query must be between 1 and 100 characters.");
    }
}