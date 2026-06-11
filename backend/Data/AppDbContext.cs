using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


// Database context for the application, managing entity operations and database connections
namespace backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        // Database table mappings - Entity Framework will create corresponding tables
        public DbSet<User> Users => Set<User>();
        public DbSet<TokenBlacklist> TokenBlacklists => Set<TokenBlacklist>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
        public DbSet<Shrine> Shrines => Set<Shrine>();
        public DbSet<ShrineTranslation> ShrineTranslations => Set<ShrineTranslation>();
        public DbSet<ShrineImage> ShrineImages => Set<ShrineImage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.GoogleId)
                    .IsRequired(false)
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Password)
                    .IsRequired(false)
                    .HasMaxLength(500);

                entity.Property(e => e.Picture)
                    .IsRequired(false)
                    .HasMaxLength(500);

                entity.Property(e => e.Bio)
                    .IsRequired(false)
                    .HasMaxLength(300);

                entity.Property(e => e.Location)
                    .IsRequired(false)
                    .HasMaxLength(100);

                entity.Property(e => e.FavoriteGoods)
                    .IsRequired(false);

                entity.Property(e => e.BirthDate)
                    .IsRequired(false);

                entity.Property(e => e.CreatedAt)
                 .IsRequired()
                 .HasDefaultValueSql("GETUTCDATE()");

                // Index
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.GoogleId)
                    .IsUnique()
                    .HasFilter("[GoogleId] IS NOT NULL");
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.ToTable("RefreshTokens");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.TokenHash)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.ExpiresAt)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.RevokedAt)
                    .IsRequired(false);

                entity.Property(e => e.Reason)
                    .IsRequired(false)
                    .HasMaxLength(50);

                // FK
                entity.HasOne(e => e.User)
                    .WithMany(u => u.RefreshTokens)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Index
                entity.HasIndex(e => e.TokenHash).IsUnique();
                entity.HasIndex(e => e.UserId);
            });

            modelBuilder.Entity<TokenBlacklist>(entity =>
                 {
                     entity.ToTable("TokenBlacklists");
                     entity.HasKey(e => e.Id);

                     entity.Property(e => e.Id)
                         .HasDefaultValueSql("NEWID()")
                         .ValueGeneratedOnAdd();

                     entity.Property(e => e.Jti).HasMaxLength(100);

                     // Index
                     entity.HasIndex(e => e.Jti).IsUnique();
                     entity.HasIndex(rt => rt.UserId);
                     entity.HasIndex(rt => rt.ExpiresAt);
                 });

            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.ToTable("PasswordResetTokens");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.TokenHash)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.ExpiresAt)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.TokenHash).IsUnique();
                entity.HasIndex(e => e.UserId);
            });

            modelBuilder.Entity<Shrine>(entity =>
            {
                entity.ToTable("Shrines");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Latitude)
                    .IsRequired(false);

                entity.Property(e => e.Longitude)
                    .IsRequired(false);

                entity.Property(e => e.Founded)
                    .IsRequired(false)
                    .HasMaxLength(50);

                entity.Property(e => e.Website)
                    .IsRequired(false)
                    .HasMaxLength(500);
            });

            modelBuilder.Entity<ShrineImage>(entity =>
            {
                entity.ToTable("ShrineImages");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.HasOne(e => e.Shrine)
                    .WithMany(s => s.Images)
                    .HasForeignKey(e => e.ShrineId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.ShrineId);
            });

            modelBuilder.Entity<ShrineTranslation>(entity =>
            {
                entity.ToTable("ShrineTranslations");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("NEWID()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Locale)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Prefecture)
                    .IsRequired(false)
                    .HasMaxLength(50);

                entity.Property(e => e.City)
                    .IsRequired(false)
                    .HasMaxLength(50);

                entity.Property(e => e.Region)
                    .IsRequired(false)
                    .HasMaxLength(50);

                entity.Property(e => e.Address)
                    .IsRequired(false)
                    .HasMaxLength(300);

                entity.Property(e => e.Description)
                    .IsRequired(false)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.OpeningHours)
                    .IsRequired(false)
                    .HasMaxLength(200);

                entity.Property(e => e.Access)
                    .IsRequired(false)
                    .HasMaxLength(500);

                entity.Property(e => e.EnshrineDeity)
                    .IsRequired(false)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Benefits)
                    .IsRequired(false)
                    .HasColumnType("nvarchar(max)");

                entity.HasOne(e => e.Shrine)
                    .WithMany(s => s.Translations)
                    .HasForeignKey(e => e.ShrineId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.ShrineId, e.Locale }).IsUnique();
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.Locale);
            });
        }
    }
}