using ChatApp.Messaging.Application.DTOs;
using ChatApp.Messaging.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatApp.Messaging.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessagingService _messagingService;
    private readonly IValidator<SendMessageRequest> _validator;

    public MessagesController(IMessagingService messagingService, IValidator<SendMessageRequest> validator)
    {
        _messagingService = messagingService;
        _validator = validator;
    }

    [HttpPost]
    public async Task<ActionResult<MessageResponse>> SendMessage([FromBody] SendMessageRequest request, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var message = await _messagingService.SendMessageAsync(currentUserId, request.ConversationId, request.Content, cancellationToken);
        return Ok(message);
    }

    [HttpGet("conversation/{conversationId}")]
    public async Task<ActionResult<List<MessageResponse>>> GetConversationHistory(
        Guid conversationId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
        try
        {
            var messages = await _messagingService.GetConversationHistoryAsync(currentUserId, conversationId, page, pageSize, cancellationToken);
            return Ok(messages);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }
}