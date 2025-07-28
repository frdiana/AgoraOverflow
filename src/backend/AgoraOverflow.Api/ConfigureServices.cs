using FluentValidation;
using static AgoraOverflow.Api.Features.Chat.ReplyToUser;

namespace AgoraOverflow.Api;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {

        builder.Services.AddValidatorsFromAssemblyContaining<RequestValidator>();
    }
}
