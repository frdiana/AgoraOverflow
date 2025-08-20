// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.Agents.Runtime.InProcess;
using Microsoft.SemanticKernel.ChatCompletion;

namespace AgoraOverflow.AgentsOrchestrator;

public class AgentsOrchestratorManager(ILogger<AgentsOrchestratorManager> logger, Kernel kernel, IAgentBuilder agentBuilder, OrchestrationMonitor orchestrationMonitor)
{
    public async Task<string> AskAgentsAsync(string question)
    {
#pragma warning disable SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        GroupChatOrchestration orchestration =
            new(
                new AIGroupChatManager(
                    question,
                    kernel.GetRequiredService<IChatCompletionService>())
                {
                    MaximumInvocationCount = 3,
                },
                [.. agentBuilder.BuildAgents()])
            {
                ResponseCallback = orchestrationMonitor.ResponseCallback,
            };

        InProcessRuntime runtime = new();
        await runtime.StartAsync();

        // Run the orchestration
        Console.WriteLine($"\n# INPUT: {question}\n");
        OrchestrationResult<string> result = await orchestration.InvokeAsync(question, runtime);
        string text = await result.GetValueAsync();
        Console.WriteLine($"\n# RESULT: {text}");
        await runtime.RunUntilIdleAsync();
        return text;
#pragma warning restore SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    }

}
