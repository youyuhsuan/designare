using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public static class DataSeeder
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public static async Task SeedShrinesAsync(AppDbContext context, ILogger logger)
    {
        if (await context.Shrines.AnyAsync())
        {
            logger.LogInformation("Shrine table already has data. Skipping seed.");
            return;
        }

        var path = Path.Combine(AppContext.BaseDirectory, "Data", "SeedData", "shrines.json");

        if (!File.Exists(path))
        {
            logger.LogWarning("Shrine seed file not found at {Path}.", path);
            return;
        }

        await using var stream = File.OpenRead(path);
        List<ShrineRecord>? records;

        try
        {
            records = await JsonSerializer.DeserializeAsync<List<ShrineRecord>>(stream, _jsonOptions);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to parse shrine seed file.");
            return;
        }

        if (records is null || records.Count == 0) return;

        var shrines = records.Select(r =>
        {
            var shrine = new Shrine
            {
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                Founded = r.Founded,
                Website = string.IsNullOrEmpty(r.Website) ? null : r.Website,
            };

            if (!string.IsNullOrEmpty(r.ImageUrl))
                shrine.Images = [new ShrineImage { Url = r.ImageUrl }];

            shrine.Translations = r.Translations
                .Select(kv => new ShrineTranslation
                {
                    Locale = kv.Key,
                    Name = kv.Value.Name,
                    Prefecture = kv.Value.Prefecture,
                    City = kv.Value.City,
                    Region = kv.Value.Region,
                    Address = kv.Value.Address,
                    Description = kv.Value.Description,
                    OpeningHours = kv.Value.OpeningHours,
                    Access = kv.Value.Access,
                    EnshrineDeity = kv.Value.EnshrineDeity is { Length: > 0 }
                        ? JsonSerializer.Serialize(kv.Value.EnshrineDeity)
                        : null,
                    Benefits = kv.Value.Benefits is { Length: > 0 }
                        ? JsonSerializer.Serialize(kv.Value.Benefits)
                        : null,
                })
                .ToList();

            return shrine;
        }).ToList();

        await context.Shrines.AddRangeAsync(shrines);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} shrines with {TranslationCount} translations.",
            shrines.Count,
            shrines.Sum(s => s.Translations.Count));
    }

    private sealed class ShrineRecord
    {
        public double? Latitude { get; init; }
        public double? Longitude { get; init; }

        [JsonConverter(typeof(FoundedConverter))]
        public string? Founded { get; init; }

        public string? Website { get; init; }
        public string? ImageUrl { get; init; }

        public Dictionary<string, TranslationRecord> Translations { get; init; } = [];
    }

    private sealed class TranslationRecord
    {
        public string Name { get; init; } = string.Empty;
        public string? Prefecture { get; init; }
        public string? City { get; init; }
        public string? Region { get; init; }
        public string? Address { get; init; }
        public string? Description { get; init; }
        public string? OpeningHours { get; init; }
        public string? Access { get; init; }
        public string[]? EnshrineDeity { get; init; }
        public string[]? Benefits { get; init; }
    }

    // `founded` can be an integer (e.g. 807) or a string (e.g. "ancient")
    private sealed class FoundedConverter : JsonConverter<string?>
    {
        public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TokenType switch
            {
                JsonTokenType.Number => reader.GetInt64().ToString(),
                JsonTokenType.String => reader.GetString(),
                JsonTokenType.Null => null,
                _ => reader.GetString(),
            };
        }

        public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
            => writer.WriteStringValue(value);
    }
}
