using Projects;

var builder = DistributedApplication.CreateBuilder(args);

#pragma warning disable ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

var cosmos = builder
    .AddAzureCosmosDB("cosmos-db")
    .RunAsPreviewEmulator(
    emulator =>
    {
        emulator.WithDataVolume();
        emulator.WithDataExplorer();
    });
var db = cosmos.AddCosmosDatabase("db");
var conversationsContainer = db.AddContainer("conversations", "/id");


#pragma warning restore ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.



var ollama = builder
    .AddOllama("ollama")
    .WithGPUSupport()
    .WithDataVolume();

var phi4 = ollama.AddModel("phi4-mini", "phi4-mini");


var api = builder
    .AddProject<AgoraOverflow_Api>("agoraoverflow-api")
    .WaitFor(db)
    .WithReference(conversationsContainer)
    .WithReference(ollama)
    .WithReference(phi4);

builder
    .AddViteApp("clientApp", "../../clientApp")
    .WithNpmPackageInstallation()
    .WithEnvironment("VITE_API_BASE_PATH", api.GetEndpoint("https"))
    .WithExternalHttpEndpoints()
    .WaitFor(api);

builder.Build().Run();
