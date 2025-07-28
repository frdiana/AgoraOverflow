using AgoraOverflow.Api.Common;
using AgoraOverflow.Api.Common.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AgoraOverflow.Api.Features.Chat;

public class ReplyToUser : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{chatId:guid}/ask", HandleRequest)
        .WithSummary("Creates a new turn user/agents")
        .WithRequestValidation<Request>();

    private static Ok<Response> HandleRequest(Guid chatId, Request request, CancellationToken cancellationToken)
    {
        Response response = new($"You said: {request.UserMessage} from chatId:{chatId}", "noAgent");
        return TypedResults.Ok(response);
    }

    public record Request(string UserMessage);
    public record Response(string Reply, string fromAgent);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.UserMessage)
                .NotEmpty()
                .MaximumLength(500);
        }
    }
}
