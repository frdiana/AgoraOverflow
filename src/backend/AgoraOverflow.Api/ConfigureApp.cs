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
