public class JwtOptions
{
    public required string SecretKey {get; set;}
    public int ExpiryMinutes {get; set;}
}