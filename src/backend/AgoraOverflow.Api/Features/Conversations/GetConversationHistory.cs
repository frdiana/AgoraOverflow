using AgoraOverflow.Api.Common;
using AgoraOverflow.Domain.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Azure.Cosmos;

namespace AgoraOverflow.Api.Features.Chat;

public class GetConversationHistory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("conversations/history", HandleRequest)
        .WithSummary("Gets the conversations");

    private static Ok<List<Conversation>> HandleRequest([FromKeyedServices("conversations")] Container container, CancellationToken cancellationToken)
    {

        List<Conversation> conversations = [.. container.GetItemLinqQueryable<Conversation>(allowSynchronousQueryExecution: true)];
        List<ConversationsResponse> conversationsResponse = [];
        foreach (var conversation in conversations)
        {
            conversation.Messages.Sort((x, y) => x.Timestamp.CompareTo(y.Timestamp));
        }
        return TypedResults.Ok(conversations);
    }

    public record ConversationsResponse(string ConversationName, Guid ConversationId);


}
