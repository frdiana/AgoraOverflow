using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace AgoraOverflow.AgentsOrchestrator;

public sealed class OrchestrationMonitor
{
    public List<StreamingChatMessageContent> StreamedResponses = [];

    public ChatHistory History { get; } = [];

    public ValueTask ResponseCallback(ChatMessageContent response)
    {
        this.History.Add(response);
        return ValueTask.CompletedTask;
    }

    public ValueTask StreamingResultCallback(StreamingChatMessageContent streamedResponse, bool isFinal)
    {
        this.StreamedResponses.Add(streamedResponse);

        if (isFinal)
        {
            this.StreamedResponses.Clear();
        }

        return ValueTask.CompletedTask;
    }
}

