// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

using AgoraOverflow.Api;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();

try
{
    Log.Information("Starting web application");
    var builder = WebApplication.CreateBuilder(args);
    // Aspire service defaults
    builder.AddServiceDefaults();

    builder.AddServices();
    var app = builder.Build();
    await app.Configure();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
