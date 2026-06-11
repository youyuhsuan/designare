using backend.DTOs;
using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services
{
    public interface IShrineService
    {
        Task<IEnumerable<ShrineSuggestionDto>> GetSuggestionsByKeywordAsync(string keyword, string locale = "en");
        Task<IEnumerable<ShrineDto>> GetFeaturedAsync(string locale = "en");
        Task<PagedResult<ShrineDto>> GetShrinesAsync(ShrineSearchRequest request, string locale = "en");
        Task<ShrineDetailDto?> GetShrineByIdAsync(Guid id, string locale = "en");
    }
}