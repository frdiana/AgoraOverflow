using FluentValidation;
using static AgoraOverflow.Api.Features.Chat.ReplyToUser;

namespace AgoraOverflow.Api;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {

        builder.Services.AddValidatorsFromAssemblyContaining<RequestValidator>();
        // Add this after builder creation
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });
    }
}
