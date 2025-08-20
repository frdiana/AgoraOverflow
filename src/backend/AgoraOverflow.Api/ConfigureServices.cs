// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using AgoraOverflow.AgentsOrchestrator;
using FluentValidation;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using static AgoraOverflow.Api.Features.Chat.ReplyToUser;

namespace AgoraOverflow.Api;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddKeyedAzureCosmosContainer("conversations");
        builder.AddAzureChatCompletionsClient(connectionName: "foundry").AddChatClient("gpt-4o");



        //builder.AddOllamaApiClient("ollama", s => s.SelectedModel = "phi4-mini").AddChatClient();
        builder.Services.AddValidatorsFromAssemblyContaining<RequestValidator>();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                }
            );
        });

        builder.Services.AddSingleton<IChatCompletionService>(sp =>
        {
            var client = sp.GetRequiredService<IChatClient>();
#pragma warning disable SKEXP0001 // AsChatCompletionService is for evaluation purposes only
            return client.AsChatCompletionService(); // adapter provided by SK
#pragma warning restore SKEXP0001
        });
        builder.Services.AddKernel();

        builder.Services.AddSingleton<IAgentBuilder, LocalAgentsBuilder>();
        builder.Services.AddScoped<AgentsOrchestratorManager>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<AgentsOrchestratorManager>>();
            var kernel = sp.GetRequiredService<Kernel>();
            var agentBuilder = sp.GetRequiredService<IAgentBuilder>();
            var orchestrationMonitor = new OrchestrationMonitor();

            return new AgentsOrchestratorManager(
                logger,
                kernel,
                agentBuilder,
                orchestrationMonitor);
        });
    }
}
