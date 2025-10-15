import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AccountService } from './account-service';
import { Member } from '../../types/member';
import { Message, MessageSend } from '../../types/message';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { single } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl='https://localhost:7001/';
  private http = inject(HttpClient);
  private accountService=inject(AccountService)
  hubConnection?:HubConnection;
  messageThread = signal<Message[]>([]);
 
  createHubConnection(otherUserId:string){
    const currentUser = this.accountService.currentUser();
    if(!currentUser)
       return;

    this.hubConnection=new HubConnectionBuilder().withUrl(this.baseUrl + 'hubs/messages?userId='+otherUserId ,{
      accessTokenFactory:()=>currentUser.token
    })
    .withAutomaticReconnect().build();

    this.hubConnection.start().catch(error =>console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages:Message[])=>{
      
          this.messageThread.set(messages.map(msg => ({
            ...msg,
            currentUserSender: msg.senderId !== otherUserId,
          })));
    })
        this.hubConnection.on("NewMessage",(message:Message)=>{
          message.currentUserSender=message.senderId===currentUser.id;
          this.messageThread.update(messages=>[...messages,message])         
        })
  }

  stopHubConnection(){
    if(this.hubConnection?.state===HubConnectionState.Connected)
      this.hubConnection.stop().catch(error=>console.log(error));
  }

  getMessagesList()
  {
    return this.http.get<Member[]>(this.baseUrl + 'api/messages/chatlist/'+this.accountService.currentUser()?.id);
  }

  getMessagesThread(memberId:string){
    return this.http.get<Message[]>(this.baseUrl+'api/messages/thread/'+memberId);
  }

   sendMessage(Creds:MessageSend){
    return this.hubConnection?.invoke('SendMessage',{
    recipientId: Creds.recipientId,
    content: Creds.content,
    messageType: Creds.messageType
  });
  }

  deleteMessage(id:string)
  {
   return this.http.delete(this.baseUrl+'api/messages/'+id);
  }
}
