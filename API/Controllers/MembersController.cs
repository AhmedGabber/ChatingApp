using API.Data;
using API.Entites;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]//http://localhost:7001/api/members
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers() 
        {
            var members =await context.Users.ToListAsync();
            return  Ok(members);
        }

        [HttpGet("{id}")] //api/members/3
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await context.Users.FindAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }
    }

    
}
