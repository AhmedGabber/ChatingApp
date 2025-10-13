using System.Linq.Expressions;
using API.DTOs;
using API.Entites;

namespace API.Extentions;

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            content = message.content,
            DateRead = message.DateRead,
            SenderId = message.SenderId,
            MessageSent = message.MessageSent,
            SenderDisplayName = message.Sender.DisplayName,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientId = message.SenderId,
            RecipientImageUrl = message.Recipient.ImageUrl,
            RecipientDisplayName = message.Recipient.DisplayName,
            MessageType = message.MessageType

        };

    }
    
    public static Expression<Func<Message, MessageDto>> ToDtoProjection()
    {
        return message => new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderDisplayName = message.Sender.DisplayName,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientId = message.RecipientId,
            RecipientDisplayName = message.Recipient.DisplayName,
            RecipientImageUrl = message.Recipient.ImageUrl,
            content = message.content,
            DateRead = message.DateRead,
            MessageSent = message.MessageSent,
            MessageType = message.MessageType
        };
    }
}
