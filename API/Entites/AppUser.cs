namespace API.Entites;

public class AppUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public bool EmailConfirmed { get; set; }
    public string? EmailVerificationToken { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? TokenExpiry { get; set; }
    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }

    public Member Member { get; set; } = null!;
}
