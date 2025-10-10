using System;
using API.DTOs;
using API.Entites;
using API.Extentions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string MessagrId)
    {
        return await context.Messages.FindAsync(MessagrId);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessagesThread(string currentMemberId, string recipientId)
    {
       var memb = await context.Messages
       .Where(x => x.RecipientId == currentMemberId &&
        x.SenderId == recipientId && x.DateRead == null)
        .ExecuteUpdateAsync(x => x.SetProperty(x => x.DateRead, DateTime.UtcNow));
        
        return await context.Messages.Where
        (x => (x.RecipientId == currentMemberId && x.SenderId == recipientId && x.RecipientDeleted==false ) || (x.RecipientId == recipientId && x.SenderId == currentMemberId && x.SenderDeleted==false))
        .OrderBy(x => x.MessageSent).Select(MessageExtensions.ToDtoProjection()).ToListAsync();
                          
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
