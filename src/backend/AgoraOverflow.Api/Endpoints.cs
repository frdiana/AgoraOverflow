using AgoraOverflow.Api.Common;
using AgoraOverflow.Api.Common.Filters;
using AgoraOverflow.Api.Features.Chat;

namespace AgoraOverflow.Api;

public static class Endpoints
{
    public static void MapEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("")
            .AddEndpointFilter<RequestLoggingFilter>()
            .WithOpenApi();

        endpoints.MapChatEndpoints();
    }

    private static void MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("")
            .WithTags("Chat");

        endpoints.MapPublicGroup()
            .MapEndpoint<StartNewConversation>()
            .MapEndpoint<GetConversationHistory>()
            .MapEndpoint<ReplyToUser>();

        //endpoints.MapAuthorizedGroup()
        //    .MapEndpoint<StartNewChat>()
        //    .MapEndpoint<ReplyToUser>();
    }

    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .AllowAnonymous();
    }

    private static RouteGroupBuilder MapAuthorizedGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .RequireAuthorization();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndpoint
    {
        TEndpoint.Map(app);
        return app;
    }
}
