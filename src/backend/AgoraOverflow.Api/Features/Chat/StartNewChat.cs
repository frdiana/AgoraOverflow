using AgoraOverflow.Api.Common;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AgoraOverflow.Api.Features.Chat;

public class StartNewChat : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/start", Handle)
        .WithSummary("Creates a new chat");

    public record Request();
    public record Response(Guid ChatId);


    private static async Task<Ok<Response>> Handle(CancellationToken cancellationToken)
    {
        Response response = new(Guid.NewGuid());
        return TypedResults.Ok(response);
    }
}
