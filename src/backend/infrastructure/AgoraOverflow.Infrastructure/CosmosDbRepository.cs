// Copyright (c) 2025 Francesco Diana
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

//namespace AgoraOverflow.Infrastructure;

//public class CosmosDbRepository<T> : IDisposable where T : class
//{
//    private readonly CosmosClient _cosmosClient;
//    private readonly Container _container;
//    private readonly string _partitionKeyPath;
//    private bool _disposed;

//    // Constructor for Managed Identity
//    public CosmosDbRepository(string accountEndpoint, string databaseId, string containerId, string partitionKeyPath)
//    {
//        _cosmosClient = new CosmosClient(accountEndpoint, new DefaultAzureCredential());
//        _container = _cosmosClient.GetContainer(databaseId, containerId);
//        _partitionKeyPath = partitionKeyPath;
//    }

//    // Constructor for Connection String
//    public CosmosDbRepository(string connectionString, string databaseId, string containerId, string partitionKeyPath, bool useConnectionString)
//    {
//        _cosmosClient = new CosmosClient(connectionString);
//        _container = _cosmosClient.GetContainer(databaseId, containerId);
//        _partitionKeyPath = partitionKeyPath;
//    }

//    // Create
//    public async Task<T> CreateAsync(T item, string partitionKey)
//    {
//        var response = await _container.CreateItemAsync(item, new PartitionKey(partitionKey));
//        return response.Resource;
//    }

//    // Read by ID
//    public async Task<T?> GetByIdAsync(string id, string partitionKey)
//    {
//        try
//        {
//            var response = await _container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));
//            return response.Resource;
//        }
//        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
//        {
//            return null;
//        }
//    }

//    // Read with query
//    public async Task<List<T>> GetItemsAsync(string queryString)
//    {
//        var query = _container.GetItemQueryIterator<T>(new QueryDefinition(queryString));
//        var results = new List<T>();

//        while (query.HasMoreResults)
//        {
//            var response = await query.ReadNextAsync();
//            results.AddRange(response.ToList());
//        }

//        return results;
//    }

//    // Update
//    public async Task<T> UpdateAsync(string id, T item, string partitionKey)
//    {
//        var response = await _container.ReplaceItemAsync(item, id, new PartitionKey(partitionKey));
//        return response.Resource;
//    }

//    // Delete
//    public async Task<bool> DeleteAsync(string id, string partitionKey)
//    {
//        try
//        {
//            await _container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey));
//            return true;
//        }
//        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
//        {
//            return false;
//        }
//    }

//    public void Dispose()
//    {
//        Dispose(true);
//        GC.SuppressFinalize(this);
//    }

//    protected virtual void Dispose(bool disposing)
//    {
//        if (!_disposed)
//        {
//            if (disposing)
//            {
//                _cosmosClient?.Dispose();
//            }
//            _disposed = true;
//        }
//    }
//}
