namespace backend.DTOs.Requests
{
    public class ShrineSearchRequest
    {
        public string? Shrine { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}