// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using Newtonsoft.Json;

namespace AgoraOverflow.Domain.Models;

public class Conversation
{
    [JsonProperty("id")]
    public Guid Id { get; set; }
    [JsonProperty("name")]
    public string Name { get; set; } = string.Empty;
    [JsonProperty("messages")]
    public List<Message> Messages { get; set; } = [];
    [JsonProperty("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [JsonProperty("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Message
{
    [JsonProperty("id")]
    public Guid Id { get; set; }
    [JsonProperty("content")]
    public string Content { get; set; } = string.Empty;
    [JsonProperty("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    [JsonProperty("sender")]
    public string Sender { get; set; } = string.Empty; // Could be "user" or "agent name"
}
