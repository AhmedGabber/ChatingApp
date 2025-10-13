import { Component, inject, OnInit, signal } from '@angular/core';
import { Member } from '../../../types/member';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './member-profile-edit.html',
  styleUrl: './member-profile-edit.css'
})


export class MemberProfileEdit implements OnInit {

  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  previewUrl: string | ArrayBuffer | null = null;
  creds: any = {
    displayName: '',
    memberImageUrl: ''
  };

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member'])
    })

  };


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.creds.memberImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveMember() {
    this.memberService.UpdateMember(this.creds.displayName, this.creds.memberImageUrl).subscribe({
      next: () => {
        this.toastService.success('Profile updated successfully!', 4000);
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          user.displayName=this.creds.displayName;
          user.imageUrl=this.creds.imageUrl;
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/members']);
        }
        this.creds.displayName = '';
        this.creds.imageUrl = '';
      },
      error: () => {
        this.toastService.error('Failed to update profile', 4000);
      }
    })
  }


  goBack() {
    this.router.navigate(['/members']);
  }



}
