namespace backend.Models
{
    public sealed class ShrineImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ShrineId { get; set; }

        public string Url { get; set; } = string.Empty;

        public Shrine Shrine { get; set; } = null!;
    }
}
