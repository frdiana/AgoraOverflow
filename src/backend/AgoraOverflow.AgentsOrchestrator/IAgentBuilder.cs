// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using Microsoft.SemanticKernel.Agents;

namespace AgoraOverflow.AgentsOrchestrator;

public interface IAgentBuilder
{
    public List<ChatCompletionAgent> BuildAgents();
}
