using System;
using System.Threading.Tasks;
using API.Entites;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberAsync(string id)
    {
        return await context.Members.Include(m=>m.User).FirstOrDefaultAsync( m=>m.Id == id);
    }


    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await context.Members.ToListAsync();
    }
    public async Task<IReadOnlyList<Member>> GetChatListAsync(string currentMemberId)
    {

        var messages = await context.Messages
            .Where(m => m.SenderId == currentMemberId || m.RecipientId == currentMemberId)
            .ToListAsync();

        var lastMessages = messages
            .GroupBy(m => m.SenderId == currentMemberId ? m.RecipientId : m.SenderId)
            .Select(g => g.OrderByDescending(m => m.MessageSent).First())
            .OrderByDescending(m => m.MessageSent)
            .ToList();


        var memberIds = lastMessages
            .Select(m => m.SenderId == currentMemberId ? m.RecipientId : m.SenderId)
            .ToList();

        var members = await context.Members
            .Where(m => memberIds.Contains(m.Id))
            .ToListAsync();


        var sorted = memberIds
            .Select(id => members.First(m => m.Id == id))
            .ToList();

        return sorted;

    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
    
    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync()>0;
    }




}
