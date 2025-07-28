using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<AgoraOverflow_Api>("agoraoverflow-api");


//builder.AddNpmApp("clientApp", "../../clientApp", "dev")
//       .WithNpmPackageInstallation()
//       .WithExternalHttpEndpoints()
//       .WaitFor(api);

builder.AddViteApp("clientApp", "../../clientApp")
       .WithNpmPackageInstallation()
       .WithEnvironment("VITE_API_BASE_PATH", api.GetEndpoint("https"))
       .WithExternalHttpEndpoints()
       .WaitFor(api);

builder.Build().Run();
