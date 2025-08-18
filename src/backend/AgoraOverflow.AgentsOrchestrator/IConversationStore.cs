using Microsoft.SemanticKernel;

namespace AgoraOverflow.AgentsOrchestrator;

public interface IConversationStore
{
    IReadOnlyList<ChatMessageContent> GetMessages(Guid id);
    void SaveMessages(Guid id, IReadOnlyList<ChatMessageContent> history);
}

