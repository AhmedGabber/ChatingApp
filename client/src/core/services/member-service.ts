import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../../types/member';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService=inject(AccountService)
 private baseUrl ='https://localhost:7001/api/';
   
 getMembers(){
  return this.http.get<Member[]>(this.baseUrl+'members');
 }

 getMember(id:string){
  return this.http.get<Member>(this.baseUrl+'members/'+id);
 }

}
