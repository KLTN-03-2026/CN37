using System.Reflection.Emit;
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
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<UserAddress> UserAddresses { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<InventoryLog> InventoryLogs { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }

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
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdatedAt).HasColumnName("update_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasMany(x => x.UserRoles).WithOne(ur => ur.User).HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Orders).WithOne(o => o.User).HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.UserAddresses).WithOne(ua => ua.User).HasForeignKey(ua => ua.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EmailVerificationToken>(entity =>
        {
            entity.ToTable("email_verification_tokens");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.Token).HasColumnName("token").HasMaxLength(255);
            entity.Property(x => x.IsUsed).HasColumnName("used").HasDefaultValue(false);
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
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
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ExternalLogin>(entity =>
        {
            entity.ToTable("external_logins");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.Provider).HasColumnName("provider").HasMaxLength(255);
            entity.Property(x => x.ProviderUserId).HasColumnName("provider_user_id").HasMaxLength(255);
            entity.Property(x => x.Email).HasColumnName("email").HasMaxLength(255);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
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
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdatedAt).HasColumnName("update_at").HasColumnType("timestamp").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ResetPasswordToken>(entity =>
        {
            entity.ToTable("password_reset_tokens");
            entity.HasKey(x => x.Id);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.Property(x => x.TokenHash).HasColumnName("token_hash").HasMaxLength(255);
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.IsUsed).HasColumnName("is_used").HasDefaultValue(false);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.ToTable("sessions");
            entity.HasKey(x => x.Id);

            entity.HasOne(s => s.User)
                  .WithMany(u => u.Sessions)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.RefreshToken)
                  .WithOne(r => r.Session)
                  .HasForeignKey<Session>(s => s.RefreshTokenId);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id");
            entity.Property(x => x.RefreshTokenId).HasColumnName("refresh_token_id");
            entity.Property(x => x.DeviceInfo).HasColumnName("device_info").HasMaxLength(255);
            entity.Property(x => x.IpAddress).HasColumnName("ip_address").HasMaxLength(255);
            entity.Property(x => x.LastActiveAt).HasColumnName("last_active_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasColumnName("name").HasMaxLength(255);
            entity.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(255);
            entity.Property(x => x.Description).HasColumnName("description").HasMaxLength(1000);
            entity.Property(x => x.ParentId).HasColumnName("parent_id");
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
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
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
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
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(x => x.UpdateAt).HasColumnName("update_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            // 🔗 Relation Category
            entity.HasOne(x => x.Category).WithMany(c => c.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.Images).WithOne(i => i.Product).HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Specifications).WithOne(s => s.Product).HasForeignKey(s => s.ProductId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.CartItems).WithOne(ci => ci.Product).HasForeignKey(ci => ci.ProductId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Inventory).WithOne(i => i.Product).HasForeignKey<Inventory>(i => i.ProductId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.InventoryLogs).WithOne(il => il.Product).HasForeignKey(il => il.ProductId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.OrderItems).WithOne(oi => oi.Product).HasForeignKey(oi => oi.ProductId).OnDelete(DeleteBehavior.Restrict);
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

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.ToTable("carts");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            // 🔗 Relation User
            entity.HasOne(x => x.User).WithMany(u => u.Carts).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("cart_items");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.CartId).HasColumnName("cart_id").IsRequired();
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(x => x.Quantity).HasColumnName("quantity").IsRequired();
            // 🔗 Relation Cart
            entity.HasOne(x => x.Cart).WithMany(c => c.CartItems).HasForeignKey(x => x.CartId).OnDelete(DeleteBehavior.Cascade);
            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithMany(p => p.CartItems).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<UserAddress>(entity =>
        {
            entity.ToTable("user_addresses");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(x => x.ReceiverName).HasColumnName("receiver_name").HasMaxLength(100);
            entity.Property(x => x.ReceiverPhone).HasColumnName("phone").HasMaxLength(20);
            entity.Property(x => x.Province).HasColumnName("province").HasMaxLength(100);
            entity.Property(x => x.District).HasColumnName("district").HasMaxLength(100);
            entity.Property(x => x.Ward).HasColumnName("ward").HasMaxLength(100);
            entity.Property(x => x.Street).HasColumnName("address_detail").HasMaxLength(255);
            entity.Property(x => x.IsDefault).HasColumnName("is_default").HasDefaultValue(false);
            entity.Property(x => x.CreatedAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            // 🔗 Relation User
            entity.HasOne(x => x.User).WithMany(u => u.UserAddresses).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Orders).WithOne(o => o.Address).HasForeignKey(o => o.AddressId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(x => x.Description).HasColumnName("description").HasMaxLength(1000);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<UserRole>(entity =>
       {
           entity.ToTable("user_roles");
           entity.HasKey(x => new { x.UserId, x.RoleId });
           entity.HasOne(x => x.User).WithMany(u => u.UserRoles).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(x => x.Role).WithMany(r => r.UserRoles).HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Cascade);
       });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.ToTable("inventory");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.HasIndex(x => x.ProductId).IsUnique();
            entity.Property(x => x.Quantity).HasColumnName("quantity").IsRequired().HasDefaultValue(0);
            entity.Property(x => x.LastUpdated).HasColumnName("last_updated").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");
            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithOne(p => p.Inventory).HasForeignKey<Inventory>(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InventoryLog>(entity =>
        {
            entity.ToTable("inventory_logs");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(x => x.QuantityChanged).HasColumnName("quantity_change").IsRequired();
            entity.Property(x => x.QuantityBefore).HasColumnName("quantity_before").IsRequired();
            entity.Property(x => x.QuantityAfter).HasColumnName("quantity_after").IsRequired();
            entity.Property(x => x.ChangeType).HasColumnName("change_type").HasMaxLength(50).IsRequired();
            entity.Property(x => x.Note).HasColumnName("note").HasMaxLength(255);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(x => x.ProductId);
            entity.HasIndex(x => x.CreateAt);

            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithMany(p => p.InventoryLogs).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(x => x.AddressId).HasColumnName("address_id").IsRequired();
            entity.Property(x => x.TotalAmount).HasColumnName("total_amount").HasColumnType("decimal(12,2)").IsRequired();
            entity.Property(x => x.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
            entity.Property(x => x.PaymentMethod).HasColumnName("payment_method").HasMaxLength(50);
            entity.Property(x => x.PaymentStatus).HasColumnName("payment_status").HasMaxLength(50);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // 🔗 Relation Orders
            entity.HasOne(x => x.User).WithMany(u => u.Orders).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Address).WithMany(ua => ua.Orders).HasForeignKey(x => x.AddressId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.OrderItems).WithOne(oi => oi.Order).HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Payments).WithOne(p => p.Order).HasForeignKey(p => p.OrderId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.OrderId).HasColumnName("order_id").IsRequired();
            entity.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(x => x.Price).HasColumnName("price").HasColumnType("decimal(12,2)").IsRequired();
            entity.Property(x => x.Quantity).HasColumnName("quantity").IsRequired();

            // 🔗 Relation Order
            entity.HasOne(x => x.Order).WithMany(o => o.OrderItems).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
            // 🔗 Relation Product
            entity.HasOne(x => x.Product).WithMany(p => p.OrderItems).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("payments");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.OrderId).HasColumnName("order_id").IsRequired();
            entity.Property(x => x.PaymentMethod).HasColumnName("payment_method").HasMaxLength(50).IsRequired();
            entity.Property(x => x.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
            entity.Property(x => x.Amount).HasColumnName("amount").HasColumnType("decimal(12,2)").IsRequired();
            entity.Property(x => x.TransactionId).HasColumnName("transaction_id").HasMaxLength(255);
            entity.Property(x => x.CreateAt).HasColumnName("create_at").HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // 🔗 Relation Order
            entity.HasOne(x => x.Order).WithMany(o => o.Payments).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
