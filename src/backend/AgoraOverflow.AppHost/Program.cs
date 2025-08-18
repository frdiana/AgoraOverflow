using Projects;

var builder = DistributedApplication.CreateBuilder(args);


//var rgName = builder.AddParameter("azure-resource-group");
//var azureLoc = builder.AddParameter("azure-location");

//// Create the Azure environment in the Aspire model and *fix* the RG + location.
//#pragma warning disable ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
//var azure = builder.AddAzureEnvironment()
//                   .WithResourceGroup(rgName)
//                   .WithLocation(azureLoc);
//#pragma warning restore ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.









#pragma warning disable ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

var cosmos = builder
    .AddAzureCosmosDB("cosmos-db")
    .RunAsPreviewEmulator(emulator =>
    {
        emulator.WithDataVolume();
        emulator.WithDataExplorer();
    });
var db = cosmos.AddCosmosDatabase("db");
var conversationsContainer = db.AddContainer("conversations", "/id");

#pragma warning restore ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.



var ollama = builder.AddOllama("ollama").WithGPUSupport().WithDataVolume();
var phi4 = ollama.AddModel("phi4-mini", "phi4-mini");

var chatDeploymentName = "gpt-5-mini";

// Add Azure AI Foundry project

var foundry = builder.AddAzureAIFoundry("foundry");


// Add specific model deployments
var gpt5mini = foundry.AddDeployment(chatDeploymentName, chatDeploymentName, "2025-08-07", "OpenAI");







var api = builder
    .AddProject<AgoraOverflow_Api>("agoraoverflow-api")
    .WaitFor(conversationsContainer)
    .WithReference(foundry)
    .WaitFor(foundry)
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
