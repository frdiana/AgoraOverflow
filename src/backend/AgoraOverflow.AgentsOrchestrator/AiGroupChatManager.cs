// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;

namespace AgoraOverflow.AgentsOrchestrator;

public sealed class AIGroupChatManager(string topic, IChatCompletionService chatCompletion) : GroupChatManager
{
    private static class Prompts
    {
        public static string Termination(string topic) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You need to determine if the discussion has reached a conclusion. 
                If you would like to end the discussion, please set value to true, otherwise set it to false.
                You should only return true or false, nothing else otherwise the deserialization will fail.
                """;


        public static string Selection(string topic, string participants) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You need to select the next participant to speak. 
                Here are the names and descriptions of the participants: 
                {{participants}}\n
                You should return only the name of the participant you select, nothing else otherwise the deserialization will fail.
            """;

        public static string Filter(string topic) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You have just concluded the discussion. 
                Please summarize the discussion and provide a short closing statement, no more than 100 words.
            """;
    }

    /// <inheritdoc/>
    public override async ValueTask<GroupChatManagerResult<string>> FilterResults(ChatHistory history, CancellationToken cancellationToken = default)
    {
        // Get all the indexes of a message with the AuthorRole.System
        var index = history.ToList().FindLastIndex(m => m.Role == AuthorRole.User);
        // get all messages after the index if any and if not -1 the index

        if (index == -1)
        {
            // If no system message is found, return the entire history
            return new GroupChatManagerResult<string>("No Answer")
            {
                Reason = "No system message found in the history.",
            };
        }
        else
        {
            var historyToFilter = history.ToList().GetRange(index + 1, history.Count - index - 1);
            string result = "";
            foreach (var message in historyToFilter)
            {
                result += $"{message.Role}: {message.Content}\n";
            }
            return new GroupChatManagerResult<string>(result);
        }
    }

    /// <inheritdoc/>
    public override async ValueTask<GroupChatManagerResult<string>> SelectNextAgent(ChatHistory history, GroupChatTeam team, CancellationToken cancellationToken = default)
    {
        var prompt = Prompts.Selection(topic, team.FormatList());
        AzureOpenAIPromptExecutionSettings executionSettings = new()
        {
            SetNewMaxCompletionTokensEnabled = false,
            MaxTokens = 15,
        };

        ChatHistory request = [.. history, new ChatMessageContent(AuthorRole.System, prompt)];
        ChatMessageContent response = await chatCompletion.GetChatMessageContentAsync(request, executionSettings, kernel: null, cancellationToken: cancellationToken);
        string responseText = response.ToString();
        return new GroupChatManagerResult<string>(responseText)
        {
            Reason = "Selected next agent based on the discussion topic and team members.",
        };
    }

    /// <inheritdoc/>
    public override ValueTask<GroupChatManagerResult<bool>> ShouldRequestUserInput(ChatHistory history, CancellationToken cancellationToken = default) =>
            ValueTask.FromResult(new GroupChatManagerResult<bool>(false) { Reason = "The AI group chat manager does not request user input." });

    /// <inheritdoc/>
    public override async ValueTask<GroupChatManagerResult<bool>> ShouldTerminate(ChatHistory history, CancellationToken cancellationToken = default)
    {
        AzureOpenAIPromptExecutionSettings executionSettings = new()
        {
            SetNewMaxCompletionTokensEnabled = false,
            MaxTokens = 15,
        };



        GroupChatManagerResult<bool> result = await base.ShouldTerminate(history, cancellationToken);
        if (!result.Value)
        {
            var prompt = Prompts.Termination(topic);
            ChatHistory request = [.. history, new ChatMessageContent(AuthorRole.System, prompt)];
            ChatMessageContent response = await chatCompletion.GetChatMessageContentAsync(request, executionSettings, kernel: null, cancellationToken: cancellationToken);
            string responseText = response.ToString();
            bool isTerminated = bool.TryParse(responseText, out bool parsedResult) && parsedResult;
            return new GroupChatManagerResult<bool>(isTerminated)
            {
                Reason = "Determined whether to terminate the discussion based on the topic.",
            };
        }
        return result;
    }


}
