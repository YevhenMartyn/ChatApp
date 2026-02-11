namespace Application.DTOs;

public record AuthResponse(
    string Id,
    string Token,
    string Username,
    DateTime ExpiresAt
);