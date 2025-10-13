using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]//http://localhost:7001/api/members
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            var members = await memberRepository.GetMembersAsync();
            return Ok(members);
        }

        [HttpGet("{id}")] //api/members/3
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(UpdateMemberDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await memberRepository.GetMemberAsync(memberId);

            if (member == null) return BadRequest("Could not get member");

            
            if (memberUpdateDto.DisplayName?.Length > 0)
            {
                member.DisplayName = memberUpdateDto.DisplayName;
                member.User.DisplayName = memberUpdateDto.DisplayName;
            }
            else
            {
                member.DisplayName = member.User.DisplayName;
            }
            if (memberUpdateDto.MemberImageUrl?.Length > 0)
            {
                member.ImageUrl = memberUpdateDto.MemberImageUrl;
                member.User.ImageUrl = memberUpdateDto.MemberImageUrl;
            }
            else
            {
                member.ImageUrl = member.User.ImageUrl;
            }

           

            memberRepository.Update(member); 

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }

    }

}
