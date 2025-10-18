using API.Data;
using API.DTOs;
using API.Entites;
using API.Extentions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


public class AccountController : BaseApiController
{
    private readonly AppDbContext context;
    private readonly ITokenService tokenService;
    private readonly EmailService emailService;
    private readonly IConfiguration _config;

    public AccountController(AppDbContext context, ITokenService tokenService, EmailService emailService, IConfiguration config)
    {
        this.context = context;
        this.tokenService = tokenService;
        this.emailService = emailService;
        _config = config;
    }

    [HttpPost("register")]//api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await EmailExists(registerDto.Email))
        {
            return BadRequest("Email is already taken");
        }
        using var hmac = new System.Security.Cryptography.HMACSHA512();
        var verifyToken = Guid.NewGuid().ToString();
        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key,
            EmailVerificationToken = verifyToken,
            TokenExpiry = DateTime.UtcNow.AddHours(24),
            EmailConfirmed = false,

            Member = new Member
            {
                DisplayName = registerDto.DisplayName,

            }
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var verifyLink = $"http://localhost:4200/verify-email?email={user.Email}&token={verifyToken}";

        await emailService.SendEmailAsync(user.Email, "Verify your email",
        $"<p>Click the link below to activate your account:</p><a href='{verifyLink}'>Verify Email</a>");
       
        return Ok(new { message = verifyToken });
        
    }

    [HttpGet("verify-email")]
    public async Task<ActionResult<UserDto>> VerifyEmail([FromQuery] string email, [FromQuery] string token)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email && u.EmailVerificationToken == token);

        if (user == null || user.TokenExpiry < DateTime.UtcNow)
            return BadRequest("Invalid or expired verification link");

        user.EmailConfirmed = true;
        user.EmailVerificationToken = null;
        user.TokenExpiry = null; 

        await context.SaveChangesAsync();
        return user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
        if (user == null) return Unauthorized("Invalid email");
        using var hmac = new System.Security.Cryptography.HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return user.ToDto(tokenService);
        
    }

    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }
}
