using ChatApp.UserDetailsService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.UserDetailsService.Infrastructure.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.DisplayName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500);

            entity.Property(e => e.Bio)
                .HasMaxLength(500);

            entity.Property(e => e.Email)
                .HasMaxLength(256);

            entity.Property(e => e.MobilePhone)
                .HasMaxLength(20);

            entity.Property(e => e.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.DisplayName);
            entity.HasIndex(e => e.Email);
        });
    }
}