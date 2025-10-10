
using API.DTOs;
using API.Entites;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(string MessagrId);
    Task<IReadOnlyList<MessageDto>> GetMessagesThread(string currentMemberId, string RecipientId);
    Task<bool> SaveAllAsync();
    
}
