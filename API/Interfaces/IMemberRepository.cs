using API.Entites;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();

    Task<IReadOnlyList<Member>> GetChatListAsync(string currentMemberId);

    Task<Member?> GetMemberAsync(string id);

    Task<IReadOnlyList<Member>> GetMembersAsync();
    

}
