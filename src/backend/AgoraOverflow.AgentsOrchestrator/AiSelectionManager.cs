// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using System.Text.Json;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace AgoraOverflow.AgentsOrchestrator;


/// <summary>
/// AI-driven GroupChatManager: selects next agent, decides termination, and filters results.
/// Mirrors the AI-manager pattern shown in official GroupChat orchestration samples.
/// </summary>
#pragma warning disable SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
public sealed class AISelectionManager(IChatCompletionService chat, string topic) : GroupChatManager
{
    private static class Prompts
    {
        public static string Selection(string topic, string participants) => $"""
            You are a coordinator for a group of teachers. Topic: '{topic}'.
            Decide who should answer the user's latest question.
            Here are the names and descriptions of the participants:
            {participants}
            Return ONLY the exact name of the best-suited participant.
        """;

        public static string Termination(string topic) => $"""
            You are the coordinator for topic '{topic}'.
            If the user's question appears fully answered and no follow-up is needed, return True; otherwise False.
        """;

        public static string Filter(string topic) => $"""
            You are the coordinator for topic '{topic}'.
            Provide the final concise answer for the user.
        """;
    }

    public override ValueTask<GroupChatManagerResult<string>> SelectNextAgent(
        ChatHistory history, GroupChatTeam team, CancellationToken cancellationToken = default)
        => GetResponseAsync<string>(history, Prompts.Selection(topic, team.FormatList()), cancellationToken);

    public override async ValueTask<GroupChatManagerResult<bool>> ShouldTerminate(
        ChatHistory history, CancellationToken cancellationToken = default)
    {
        var baseDecision = await base.ShouldTerminate(history, cancellationToken);
        if (baseDecision.Value) return baseDecision;

        return await GetResponseAsync<bool>(history, Prompts.Termination(topic), cancellationToken);
    }

    public override ValueTask<GroupChatManagerResult<string>> FilterResults(
        ChatHistory history, CancellationToken cancellationToken = default)
        => GetResponseAsync<string>(history, Prompts.Filter(topic), cancellationToken);

    private async ValueTask<GroupChatManagerResult<TValue>> GetResponseAsync<TValue>(
        ChatHistory history, string systemPrompt, CancellationToken cancellationToken)
    {
        var exec = new OpenAIPromptExecutionSettings
        {
            // Ask the model to return JSON for GroupChatManagerResult<TValue>.
            ResponseFormat = typeof(GroupChatManagerResult<TValue>)
        };

        ChatHistory request = [.. history, new ChatMessageContent(AuthorRole.System, systemPrompt)];
        ChatMessageContent response =
            await chat.GetChatMessageContentAsync(request, exec, kernel: null, cancellationToken);

        string responseText = response.ToString() ?? string.Empty;

        return JsonSerializer.Deserialize<GroupChatManagerResult<TValue>>(responseText)
               ?? new GroupChatManagerResult<TValue>(default!);
    }

    public override ValueTask<GroupChatManagerResult<bool>> ShouldRequestUserInput(ChatHistory history, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
#pragma warning restore SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
