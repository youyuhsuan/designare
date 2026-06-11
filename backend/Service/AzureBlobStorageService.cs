using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
namespace backend.Services
{
    public class AzureBlobStorageService : IStorageService
    {
        private readonly ILogger<AzureBlobStorageService> _logger;

        public AzureBlobStorageService(ILogger<AzureBlobStorageService> logger)
        {
            _logger = logger;
        }

        public async Task<string> UploadProfilePictureAsync(string userId, IFormFile file)
        {
            string blobName = $"profile-pictures/{userId}/{Guid.NewGuid()}_{file.FileName}";

            _logger.LogInformation("UploadProfilePicture: Uploading picture for user {UserId}", userId);


            // Return a placeholder URL for now
            await Task.CompletedTask;
            return $"https://placeholder.blob.core.windows.net/profile-pictures/{userId}.jpg";
        }

        public async Task DeleteProfilePictureAsync(string pictureUrl)
        {
            // TODO: Replace with real Azure Blob Storage implementation
            _logger.LogInformation("DeleteProfilePicture: Deleting picture at {Url}", pictureUrl);
            await Task.CompletedTask;
        }
    }
}