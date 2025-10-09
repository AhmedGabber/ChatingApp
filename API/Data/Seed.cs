using System;
using System.Security.Cryptography;
using API.Entites;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedMembers(AppDbContext context)
    {
        if (await context.Members.AnyAsync()) return;
        var MembersData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = System.Text.Json.JsonSerializer.Deserialize<List<DTOs.SeedUserDto>>(MembersData);
        if (members == null) return;
        

        foreach (var member in members)
        {
          HMACSHA512 hmac = new(); 
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,

                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    ImageUrl = member.ImageUrl,
                    Created = member.Created,
                    LastActive = member.LastActive
                }
            };

            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
        
  }
}
