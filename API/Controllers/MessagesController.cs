using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Extentions;
using API.Interfaces;

using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController(IMessageRepository messageRepository, IMemberRepository memberRepository) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberAsync(User.GetMemberId());
            var recipient = await memberRepository.GetMemberAsync(createMessageDto.RecipientId);

            if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
                return BadRequest("Cannot send this message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                content = createMessageDto.content
            };

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync()) return message.ToDto();

            return BadRequest("Faild to send message");
        }


        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok(await messageRepository.GetMessagesThread(User.GetMemberId(), recipientId));
        }

        [HttpGet("chatlist/{currentid}")]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetChatList(string currentid)
        {
            return Ok(await memberRepository.GetChatListAsync(User.GetMemberId()));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.GetMemberId();

            var message = await messageRepository.GetMessage(id);

            if (message == null) return BadRequest("cannot delete message");

            if (message.SenderId != memberId && message.RecipientId != memberId) return BadRequest("you cannot delete this message");

            if (message.SenderId == memberId) message.SenderDeleted = true;
            if (message.RecipientId == memberId) message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
            {
                messageRepository.DeleteMessage(message);
            }

            if (await messageRepository.SaveAllAsync()) return Ok();

            return BadRequest("problem deleting message");

        }

    }
}
