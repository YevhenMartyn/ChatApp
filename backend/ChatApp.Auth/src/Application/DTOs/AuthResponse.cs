namespace Application.DTOs;

public record AuthResponse(
    string Token,
    string Username,
    DateTime ExpiresAt
);