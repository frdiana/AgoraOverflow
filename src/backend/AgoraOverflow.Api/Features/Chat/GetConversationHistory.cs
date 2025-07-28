using AgoraOverflow.Api.Common;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AgoraOverflow.Api.Features.Chat;

public class GetConversationHistory : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/history", HandleRequest)
        .WithSummary("Gets the conversations");

    private static Ok<List<Response>> HandleRequest(CancellationToken cancellationToken)
    {
        Response response = new("Sample Conversation", Guid.NewGuid());
        Response response1 = new("Another Conversation", Guid.NewGuid());
        Response response2 = new("Third Conversation", Guid.NewGuid());
        List<Response> conversations = [response, response1, response2];
        return TypedResults.Ok(conversations);
    }

    public record Response(string ConversationName, Guid ConversationId);


}