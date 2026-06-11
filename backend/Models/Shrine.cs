using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public sealed class Shrine
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [MaxLength(50)]
        public string? Founded { get; set; }


        [MaxLength(500)]
        public string? Website { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ShrineTranslation> Translations { get; set; } = [];
        public ICollection<ShrineImage> Images { get; set; } = [];

        // public ICollection<UserCollection> Collections { get; set; } = [];
    }
}