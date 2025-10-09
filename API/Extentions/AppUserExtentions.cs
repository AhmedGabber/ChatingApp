using API.DTOs;
using API.Entites;
using API.Interfaces;

namespace API.Extentions;

public static class AppUserExtentions
{
    public static UserDto ToDto(this AppUser user, ITokenService tokenService)
    { 
        return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Image = user.ImageUrl,
            Token = tokenService.CreateToken(user)
        };
    }
}
