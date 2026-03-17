using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }
    public DbSet<RefreshToken> RefreshTokens{ get;set; }
    public DbSet<ExternalLogin> ExternalLogins { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ConfigureUser(modelBuilder);
    }
    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Email).HasMaxLength(255);
            entity.Property(x => x.PasswordHash).HasColumnName("password_hash");
            entity.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(x => x.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
            entity.Property(x => x.EmailVerifiedAt).HasColumnName("email_verified_at");
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdatedAt).HasColumnName("update_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<EmailVerificationToken>(entity =>
        {
            entity.ToTable("email_verification_tokens");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.Token).HasColumnName("token").HasMaxLength(255);
            entity.Property(x => x.IsUsed).HasColumnName("used").HasDefaultValue(false);
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("refresh_token");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.TokenHash).HasColumnName("token_hash").HasMaxLength(255);
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.IsRevoked).HasColumnName("is_revoked").HasDefaultValue(false);
            entity.Property(x => x.RevokedAt).HasColumnName("revoked_at");
            entity.Property(x => x.DeviceInfo).HasColumnName("device_info").HasMaxLength(255);
            entity.Property(x => x.IpAddress).HasColumnName("ip_address").HasMaxLength(255);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ExternalLogin>(entity =>
        {
            entity.ToTable("external_logins");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.Provider).HasColumnName("provider").HasMaxLength(255);
            entity.Property(x => x.ProviderUserId).HasColumnName("provider_user_id").HasMaxLength(255);
            entity.Property(x => x.Email).HasColumnName("email").HasMaxLength(255);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("user_profiles");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithOne().HasForeignKey<UserProfile>(x => x.UserId);
            entity.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(255);
            entity.Property(x => x.Avatar).HasColumnName("avatar").HasMaxLength(255);
            entity.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
            entity.Property(x => x.BirthDate).HasColumnName("birth_date");
            entity.Property(x => x.Gender).HasColumnName("gender").HasMaxLength(10);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");  
        });
    }
}
