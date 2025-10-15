export type Message = {
  id: string
  content: string
  dateRead?: string
  messageSent: string
  senderId: string
  senderDisplayName: string
  senderImageUrl: string
  recipientId: string
  recipientDisplayName: string
  recipientImageUrl: string
  currentUserSender?:boolean
  messageType:number
}

export type MessageSend={
  recipientId  : string
  content : string
  messageType : number
}
