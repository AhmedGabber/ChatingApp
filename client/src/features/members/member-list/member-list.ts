import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {
private memberService = inject(MemberService);
protected accountService = inject(AccountService);
protected members$:Observable<Member[]>;

constructor(){
  this.members$= this.memberService.getMembers();
}
}
