import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { EMPTY } from 'rxjs';
import { Member } from '../../../types/member';

export const memberResolver: ResolveFn<Member> = (route, state) => {

 const memberService=inject(MemberService);
 const memberId = route.paramMap.get('id');
 if (!memberId) {
  return EMPTY;
 }
 return memberService.getMember(memberId);



};
