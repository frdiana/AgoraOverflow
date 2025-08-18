using Microsoft.SemanticKernel.Agents;

namespace AgoraOverflow.AgentsOrchestrator;
public interface IAgentBuilder
{
    public List<ChatCompletionAgent> BuildAgents();
}
