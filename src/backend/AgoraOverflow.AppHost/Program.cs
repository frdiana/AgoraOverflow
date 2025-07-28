using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<AgoraOverflow_Api>("agoraoverflow-api");


builder.AddViteApp("clientApp", "../clientApp")
       .WithNpmPackageInstallation()
       .WithExternalHttpEndpoints()
       .WaitFor(api);

builder.Build().Run();
