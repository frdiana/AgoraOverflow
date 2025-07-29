using AgoraOverflow.Api.Common;
using AgoraOverflow.Domain.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Azure.Cosmos;

namespace AgoraOverflow.Api.Features.Chat;

public class StartNewConversation : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("conversations/start", Handle)
        .WithSummary("Creates a new chat");

    public record Request();
    public record Response(Guid ChatId);


    private static async Task<Ok<Response>> Handle([FromKeyedServices("conversations")] Container container, CancellationToken cancellationToken)
    {
        var conversation = new Conversation()
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Id = Guid.NewGuid(),
            Name = "New Conversation",
        };
        await container.CreateItemAsync(conversation, new PartitionKey(conversation.Id.ToString()), cancellationToken: cancellationToken);
        Response response = new(conversation.Id);
        return TypedResults.Ok(response);
    }
}
