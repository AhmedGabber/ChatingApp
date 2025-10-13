import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink ,RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../../types/member';

@Component({
  selector: 'app-member-detailed',
  imports: [ RouterLink, RouterLinkActive,RouterOutlet],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
    private router = inject(Router);
  protected member= signal<Member | undefined> (undefined);
  
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    })
    
  }

  goBack() {
    this.router.navigate(['/members']);
  }




}
