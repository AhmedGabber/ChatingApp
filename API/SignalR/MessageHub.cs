using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Extentions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub(IMessageRepository messageRepository , IMemberRepository memberRepository) :Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUserId = httpContext?.Request?.Query["userId"].ToString() ?? throw new Exception("cant get other user");

        var groupName = GetGroupName(GetUserId(), otherUserId);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var messages = await messageRepository.GetMessagesThread(GetUserId(), otherUserId);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread",messages);

    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberAsync(GetUserId());
         var recipient = await memberRepository.GetMemberAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            throw new Exception("cant send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                content = createMessageDto.content,
                MessageType = createMessageDto.MessageType               
            };

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync())
            {
            var group = GetGroupName(sender.Id, recipient.Id);   
            await Clients.Group(group).SendAsync("NewMessage",message.ToDto());
            }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    private static string GetGroupName(string? caller, string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) > 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }
    
    private string GetUserId()
    {
        return Context.User?.GetMemberId()??throw new Exception("cant get user id");
    }
}
