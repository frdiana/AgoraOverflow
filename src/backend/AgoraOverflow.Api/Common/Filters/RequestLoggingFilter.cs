// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

namespace AgoraOverflow.Api.Common.Filters;

public class RequestLoggingFilter(ILogger<RequestLoggingFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        logger.LogInformation("HTTP {Method} {Path} received", context.HttpContext.Request.Method, context.HttpContext.Request.Path);
        return await next(context);
    }
}
