namespace Application.DTOs;

public record RegisterRequest(
    string Username,
    string Password
);