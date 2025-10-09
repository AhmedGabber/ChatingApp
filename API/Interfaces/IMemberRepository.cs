using API.Entites;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();

    Task<IReadOnlyList<Member>> GetMembersAsync();

    Task<Member?> GetMemberAsync(string id);
}
