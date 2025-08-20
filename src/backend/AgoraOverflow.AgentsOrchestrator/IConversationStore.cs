// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using Microsoft.SemanticKernel;

namespace AgoraOverflow.AgentsOrchestrator;

public interface IConversationStore
{
    IReadOnlyList<ChatMessageContent> GetMessages(Guid id);
    void SaveMessages(Guid id, IReadOnlyList<ChatMessageContent> history);
}

