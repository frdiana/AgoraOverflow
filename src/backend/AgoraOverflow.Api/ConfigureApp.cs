// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

namespace AgoraOverflow.Api;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        app.UseHttpsRedirection();
        app.UseCors("AllowAll");
        app.MapEndpoints();
    }
}
