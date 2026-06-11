using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public sealed class ShrineTranslation
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ShrineId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Prefecture { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(50)]
        public string? Region { get; set; }

        [MaxLength(300)]
        public string? Address { get; set; }

        public string? Description { get; set; }

        [MaxLength(200)]
        public string? OpeningHours { get; set; }

        [MaxLength(500)]
        public string? Access { get; set; }

        // JSON-serialized string[]
        public string? EnshrineDeity { get; set; }

        // JSON-serialized string[]
        public string? Benefits { get; set; }

        public Shrine Shrine { get; set; } = null!;
    }
}
