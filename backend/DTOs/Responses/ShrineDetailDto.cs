namespace backend.DTOs.Responses
{
    public class ShrineDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Region { get; set; }
        public string? Prefecture { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public string? OpeningHours { get; set; }
        public string? Access { get; set; }
        public string? Website { get; set; }
        public string? Founded { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string> EnshrineDeity { get; set; } = [];
        public List<string> Benefits { get; set; } = [];
    }
}
