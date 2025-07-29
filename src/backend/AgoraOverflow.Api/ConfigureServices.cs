using FluentValidation;
using static AgoraOverflow.Api.Features.Chat.ReplyToUser;

namespace AgoraOverflow.Api;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddKeyedAzureCosmosContainer("conversations");
        //builder.AddOllamaApiClient("ollama").AddChatClient();

        builder.AddOllamaApiClient("ollama")
       .AddKeyedChatClient("phi4-mini");




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
