import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Member } from '../../types/member';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl='https://localhost:7001/api/';
  private http = inject(HttpClient);
  private accountService=inject(AccountService)
 

  getMessagesList()
  {
    return this.http.get<Member[]>(this.baseUrl + 'messages/chatlist/'+this.accountService.currentUser()?.id);
  }

  getMessagesThread(memberId:string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+memberId);
  }

  sendMessage(recipientId:string,content:string){
    return this.http.post<Message>(this.baseUrl+'messages',{recipientId,content});
  }

  deleteMessage(id:string)
  {
   return this.http.delete(this.baseUrl+'messages/'+id);
  }
}
