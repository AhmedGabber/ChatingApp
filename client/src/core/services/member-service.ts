import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Member } from '../../types/member';
import { AccountService } from './account-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService=inject(AccountService)
 private baseUrl ='https://localhost:7001/api/';
  curentMember = signal<Member>({
    id: '',
    displayName: '',
    imageUrl: '',
    created: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });
  member = signal<Member | null>(null);
  
   
 getMembers(){
  return this.http.get<Member[]>(this.baseUrl+'members');
 }

 getMember(id:string){
  return this.http.get<Member>(this.baseUrl+'members/'+id).pipe(
      tap(member => {
        this.member.set(member)
      })
    )
  }

  UpdateMember(displayName : string ,memberImageUrl:string ){
    return this.http.put(this.baseUrl+'members',{displayName,memberImageUrl})
  }

 getCurrentMember(){
  const account = this.accountService.currentUser();
  
  if(account){
    this.curentMember().id=account.id;
  }

 }
 }







