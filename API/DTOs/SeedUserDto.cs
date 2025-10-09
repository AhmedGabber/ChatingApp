using System;

namespace API.DTOs;

public class SeedUserDto
{
    public required string Id { get; set; }
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }

}
