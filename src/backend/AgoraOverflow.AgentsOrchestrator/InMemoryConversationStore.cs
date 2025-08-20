// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using System.Collections.Concurrent;
using Microsoft.SemanticKernel;

namespace AgoraOverflow.AgentsOrchestrator;

public sealed class InMemoryConversationStore : IConversationStore
{
    private readonly ConcurrentDictionary<Guid, List<ChatMessageContent>> _store = new();

    public IReadOnlyList<ChatMessageContent> GetMessages(Guid id) =>
        _store.TryGetValue(id, out var list) ? list : [];

    public void SaveMessages(Guid id, IReadOnlyList<ChatMessageContent> history) =>
        _store[id] = [.. history];
}

