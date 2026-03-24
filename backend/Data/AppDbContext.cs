using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<ExternalLogin> ExternalLogins { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<ResetPasswordToken> ResetPasswordTokens { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Passkey> Passkeys { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> productImages { get; set; }
    public DbSet<ProductSpecification> productSpecifications { get; set; }

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
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("user_profiles");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithOne().HasForeignKey<UserProfile>(x => x.UserId);
            entity.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(255);
            entity.Property(x => x.Avatar).HasColumnName("avatar_url").HasMaxLength(255);
            entity.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
            entity.Property(x => x.BirthDate).HasColumnName("date_of_birth");
            entity.Property(x => x.Gender).HasColumnName("gender").HasMaxLength(10);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdatedAt).HasColumnName("update_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ResetPasswordToken>(entity =>
        {
            entity.ToTable("password_reset_tokens");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.TokenHash).HasColumnName("token_hash").HasMaxLength(255);
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.IsUsed).HasColumnName("is_used").HasDefaultValue(false);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasColumnName("name").HasMaxLength(255);
            entity.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(255);
            entity.Property(x => x.Description).HasColumnName("description").HasMaxLength(1000);
            entity.Property(x => x.ParentId).HasColumnName("parent_id");
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasOne(x => x.Parent).WithMany(c => c.Children).HasForeignKey(x => x.ParentId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Passkey>(entity =>
        {
            entity.ToTable("passkeys");
            entity.HasKey(x => x.Id);
            entity.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.CredentialId).HasColumnName("credential_id").HasMaxLength(255);
            entity.Property(x => x.PublicKey).HasColumnName("public_key").HasMaxLength(1000);
            entity.Property(x => x.SignCount).HasColumnName("sign_count");
            entity.Property(x => x.DeviceName).HasColumnName("device_name").HasMaxLength(255);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(255);
            entity.Property(x => x.CategoryId).HasColumnName("category_id").IsRequired();
            entity.Property(x => x.Brand).HasColumnName("brand").HasMaxLength(100);
            entity.Property(x => x.Description).HasColumnName("description");
            entity.Property(x => x.Price).HasColumnName("price").HasColumnType("decimal(12,2)").IsRequired();
            entity.Property(x => x.DiscountPrice).HasColumnName("discount_price").HasColumnType("decimal(12,2)");
            entity.Property(x => x.Thumbnail).HasColumnName("thumbnail").HasMaxLength(500);
            entity.Property(x => x.RatingAvg).HasColumnName("rating_avg").HasColumnType("decimal(3,2)").HasDefaultValue(0);
            entity.Property(x => x.RatingCount).HasColumnName("rating_count").HasDefaultValue(0);
            entity.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdateAt).HasColumnName("update_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            // 🔗 Relation Category
            entity.HasOne(x => x.Category).WithMany(c => c.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.ToTable("product_images");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(x => x.ImageUrl).HasColumnName("image_url").HasMaxLength(500).IsRequired();
            entity.Property(x => x.IsMain).HasColumnName("is_main").HasDefaultValue(false);
            entity.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0);
            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithMany(p => p.Images).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProductSpecification>(entity =>
        {
            entity.ToTable("product_specifications");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(x => x.SpecName).HasColumnName("spec_name").HasMaxLength(255);
            entity.Property(x => x.SpecValue).HasColumnName("spec_value").HasMaxLength(255);
            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithMany(p => p.Specifications).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
