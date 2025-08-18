using System.Text.Json;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace AgoraOverflow.AgentsOrchestrator;
#pragma warning disable SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
public sealed class AIGroupChatManager(string topic, IChatCompletionService chatCompletion) : GroupChatManager
{
    private static class Prompts
    {
        public static string Termination(string topic) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You need to determine if the discussion has reached a conclusion. 
                If you would like to end the discussion, please set value to true, otherwise set it to false.
                Return a valid JSON with the following format:
                {
                    "value": true or false,
                    "reason": "Your reason for the decision"
                }
                Good examples:
                {
                    "value": true,
                    "reason": "The discussion has reached a conclusion and no further input is needed."
                }
                {
                    "value": false,
                    "reason": "The discussion is still ongoing and requires further input."
                }
                Any additional strings will cause a deserialization error, so do not add any additional strings!
                """;


        public static string Selection(string topic, string participants) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You need to select the next participant to speak. 
                Here are the names and descriptions of the participants: 
                {{participants}}\n
                Return a valid JSON with the following format:
                {
                    "value": "Name of the selected participant",
                    "reason": "Your reason for the selection"
                }
                Good examples:
                {
                    "value": "John Doe",
                    "reason": "John has the most relevant expertise on this topic."
                }
                {
                    "value": "Jane Smith",
                    "reason": "Jane has been quiet and it's her turn to contribute."
                }
                Any additional strings will cause a deserialization error, so do not add any additional strings!
            """;

        public static string Filter(string topic) =>
            $$"""
                You are mediator that guides a discussion on the topic of '{{topic}}'. 
                You have just concluded the discussion. 
                Please summarize the discussion and provide a closing statement.
                Return a valid JSON with the following format:
                {
                    "value": "Your summary and closing statement",
                    "reason": "Your reason for the summary"
                }
                Good examples:
                {
                    "value": "In conclusion, we have discussed various aspects of the topic and reached a consensus.",
                    "reason": "The discussion has provided valuable insights and perspectives."
                }
                {
                    "value": "Thank you all for your contributions. The discussion has been fruitful.",
                    "reason": "The participants have shared their views and the discussion is now complete."
                }
                Any additional strings will cause a deserialization error, so do not add any additional strings!
                """;
    }

    /// <inheritdoc/>
    public override ValueTask<GroupChatManagerResult<string>> FilterResults(ChatHistory history, CancellationToken cancellationToken = default) =>
        this.GetResponseAsync<string>(history, Prompts.Filter(topic), cancellationToken);

    /// <inheritdoc/>
    public override ValueTask<GroupChatManagerResult<string>> SelectNextAgent(ChatHistory history, GroupChatTeam team, CancellationToken cancellationToken = default) =>
        this.GetResponseAsync<string>(history, Prompts.Selection(topic, team.FormatList()), cancellationToken);

    /// <inheritdoc/>
    public override ValueTask<GroupChatManagerResult<bool>> ShouldRequestUserInput(ChatHistory history, CancellationToken cancellationToken = default) =>
        ValueTask.FromResult(new GroupChatManagerResult<bool>(false) { Reason = "The AI group chat manager does not request user input." });

    /// <inheritdoc/>
    public override async ValueTask<GroupChatManagerResult<bool>> ShouldTerminate(ChatHistory history, CancellationToken cancellationToken = default)
    {
        GroupChatManagerResult<bool> result = await base.ShouldTerminate(history, cancellationToken);
        if (!result.Value)
        {
            result = await this.GetResponseAsync<bool>(history, Prompts.Termination(topic), cancellationToken);
        }
        return result;
    }

    private async ValueTask<GroupChatManagerResult<TValue>> GetResponseAsync<TValue>(ChatHistory history, string prompt, CancellationToken cancellationToken = default)
    {
        try
        {
            //logger.LogInformation("Making LLM request for {Type}", typeof(TValue).Name);

            OpenAIPromptExecutionSettings executionSettings = new() { ResponseFormat = "json_object" };
            ChatHistory request = [.. history, new ChatMessageContent(AuthorRole.System, prompt)];
            ChatMessageContent response = await chatCompletion.GetChatMessageContentAsync(request, executionSettings, kernel: null, cancellationToken);
            string responseText = response.ToString();

            //logger.LogInformation("Received LLM response: {Response}", responseText);

            JsonSerializerOptions options = new()
            {
                PropertyNameCaseInsensitive = true
            };


            var result = JsonSerializer.Deserialize<GroupChatManagerResult<TValue>>(responseText, options);
            if (result == null)
            {
                //  logger.LogError("Failed to deserialize response: {Response}", responseText);
                throw new InvalidOperationException($"Failed to parse response: {responseText}");
            }

            //logger.LogInformation("Successfully parsed response with value: {Value}", result.Value);
            return result;
        }
        catch (Exception ex)
        {
            //logger.LogError(ex, "Error in GetResponseAsync for type {Type}", typeof(TValue).Name);

            // Provide fallback behavior
            if (typeof(TValue) == typeof(bool))
            {
                return (GroupChatManagerResult<TValue>)(object)new GroupChatManagerResult<bool>(true) { Reason = "Error occurred, terminating discussion" };
            }
            else if (typeof(TValue) == typeof(string))
            {
#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
                var agents = history.LastOrDefault()?.AuthorName ?? "unknown";
#pragma warning restore SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
                return (GroupChatManagerResult<TValue>)(object)new GroupChatManagerResult<string>(agents) { Reason = "Error occurred, selecting first available agent" };
            }

            throw;
        }
    }
}
#pragma warning restore SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
