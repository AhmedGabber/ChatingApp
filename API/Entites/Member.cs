using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entites;

public class Member
{
    public string Id { get; set; } = null!;
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    
    [JsonIgnore ]
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;
}
