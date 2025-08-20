// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using AgoraOverflow.AgentsOrchestrator;
using AgoraOverflow.Api.Common;
using AgoraOverflow.Domain.Models;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Azure.Cosmos;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace AgoraOverflow.Api.Features.Chat;

public class ReplyToUser : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/conversations/{conversationId:guid}/ask", HandleRequest)
            .WithSummary("Creates a new turn user/agents");

    //.WithRequestValidation<Request>();

    private async static Task<Results<Ok<Response>, NotFound>> HandleRequest(
        [FromKeyedServices("conversations")] Container container,
        Kernel kernel,
        AgentsOrchestratorManager agentsOrchestratorManager,
        Guid conversationId,
        Request request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            Conversation? conversation = await GetConversationById(container, conversationId);
            if (conversation == null)
            {
                return TypedResults.NotFound();
            }

            conversation.Messages.Add(
                new()
                {
                    Content = request.UserMessage,
                    Id = Guid.NewGuid(),
                    Sender = "User",
                    Timestamp = DateTime.UtcNow,
                }
            );

            var chat = kernel.GetRequiredService<IChatCompletionService>();







            //var result = await kernel.InvokePromptAsync(request.UserMessage);

            var rr = await agentsOrchestratorManager.AskAgentsAsync(request.UserMessage);

            Response response = new(rr.ToString(), "phi4Agent");

            conversation.Messages.Add(
                new()
                {
                    Content = response.Reply,
                    Id = Guid.NewGuid(),
                    Sender = "Agent",
                    Timestamp = DateTime.UtcNow,
                }
            );

            await container.UpsertItemAsync(conversation, cancellationToken: cancellationToken);
            return TypedResults.Ok(response);
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return TypedResults.NotFound();
        }
        catch (Exception ex)
        {
            // Log the exception (not shown here for brevity)
            return TypedResults.NotFound();
        }
    }

    private static async Task<Conversation?> GetConversationById(
        Container container,
        Guid conversationId
    )
    {
        try
        {
            var response = await container.ReadItemAsync<Conversation>(
                conversationId.ToString(),
                new PartitionKey(conversationId.ToString())
            );
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public record Request(string UserMessage);

    public record Response(string Reply, string AgentName);

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.UserMessage).NotEmpty().MaximumLength(500);
        }
    }
}
