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
public class ConversationsController : ControllerBase
{
    private readonly IMessagingService _messagingService;
    private readonly IValidator<StartConversationRequest> _validator;

    public ConversationsController(IMessagingService messagingService, IValidator<StartConversationRequest> validator)
    {
        _messagingService = messagingService;
        _validator = validator;
    }

    [HttpPost]
    public async Task<ActionResult<ConversationResponse>> StartConversation([FromBody] StartConversationRequest request, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var conversation = await _messagingService.StartConversationAsync(currentUserId, request.OtherUserId, cancellationToken);
        return Ok(conversation);
    }

    [HttpGet]
    public async Task<ActionResult<List<ConversationResponse>>> GetMyConversations(CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var conversations = await _messagingService.GetMyConversationsAsync(currentUserId, cancellationToken);
        return Ok(conversations);
    }
}