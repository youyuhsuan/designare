using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using backend.DTOs;
using backend.DTOs.Responses;
using backend.Services;
using backend.DTOs.Requests;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShrinesController : ControllerBase
    {
        private readonly IShrineService _shrineService;
        private readonly ILogger<ShrinesController> _logger;

        public ShrinesController(
            IShrineService shrineService,
            ILogger<ShrinesController> logger)
        {
            _shrineService = shrineService;
            _logger = logger;
        }

        private static readonly HashSet<string> _supportedLocales =
            new(["en", "zh"], StringComparer.OrdinalIgnoreCase);

        private string GetLocale() =>
            Request.Headers.AcceptLanguage
                .FirstOrDefault()
                ?.Split(',')[0]
                .Split(';')[0]
                .Trim()
                is string tag && _supportedLocales.Contains(tag)
                ? tag.ToLowerInvariant()
                : "en";

        /// <summary>
        /// GET: api/shrines/{id}
        /// Get shrine detail by ID
        /// </summary>
        /// <response code="200">Returns shrine detail</response>
        /// <response code="404">Shrine not found</response>
        [ProducesResponseType(typeof(ShrineDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ShrineDetailDto>> GetShrine(Guid id)
        {
            var locale = GetLocale();
            _logger.LogInformation("Shrine detail requested: id={Id}, locale={Locale}", id, locale);
            var shrine = await _shrineService.GetShrineByIdAsync(id, locale);
            if (shrine == null) return NotFound();
            return Ok(shrine);
        }

        /// <summary>
        /// GET: api/shrines/suggestions?keyword=
        /// Get shrine name suggestions for autocomplete
        /// </summary>
        /// <response code="200">Returns shrine suggestions</response>
        /// <response code="400">Keyword is required</response>
        [ProducesResponseType(typeof(IEnumerable<ShrineSuggestionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpGet("suggestions")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ShrineSuggestionDto>>> GetSuggestions(
            [FromQuery] string keyword)
        {
            var locale = GetLocale();
            if (string.IsNullOrWhiteSpace(keyword))
            {
                _logger.LogWarning("GetSuggestions called with empty keyword");
                return BadRequest("keyword is required");
            }

            _logger.LogInformation("Shrine suggestions requested for keyword: {Keyword}", keyword);
            var suggestions = await _shrineService.GetSuggestionsByKeywordAsync(keyword, locale);
            return Ok(suggestions);
        }

        /// <summary>
        /// GET: api/shrines/featured
        /// Get featured today shrines for homepage
        /// </summary>
        /// <response code="200">Returns featured shrines</response>
        [ProducesResponseType(typeof(IEnumerable<ShrineDto>), StatusCodes.Status200OK)]
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ShrineDto>>> GetFeaturedShrines()
        {
            var locale = GetLocale();
            _logger.LogInformation("Featured shrines requested");
            var shrines = await _shrineService.GetFeaturedAsync(locale);
            return Ok(shrines);
        }

        /// <summary>
        /// POST: api/shrines
        /// Search shrines by name
        /// </summary>
        /// <response code="200">Returns search results with pagination headers</response>
        [ProducesResponseType(typeof(IEnumerable<ShrineDto>), StatusCodes.Status200OK)]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ShrineDto>>> GetShrines(
            [FromBody] ShrineSearchRequest? request)
        {
            if (request == null)
            {
                _logger.LogWarning("GetShrines called with null request body, using empty params");
                request = new ShrineSearchRequest();
            }

            _logger.LogInformation(
                "Shrine search requested: shrine={Shrine}, page={Page}",
                request.Shrine, request.Page);

            var result = await _shrineService.GetShrinesAsync(request, GetLocale());

            var paginationMeta = new
            {
                totalPages = result.TotalPages,
                currentPage = result.CurrentPage,
                hasNextPage = result.NextPage.HasValue,
                hasPreviousPage = result.PreviousPage.HasValue,
            };
            Response.Headers["X-Pagination"] = JsonSerializer.Serialize(paginationMeta);

            return Ok(result.Items);
        }
    }
}