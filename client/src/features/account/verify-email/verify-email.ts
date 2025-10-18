import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { tap } from 'rxjs';
import { ToastService } from '../../../core/services/toast-service';


@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})


export class VerifyEmail implements OnInit {
  private accountService = inject(AccountService);
  private toasterService = inject(ToastService);
  private router = inject(Router);
  private route=inject(ActivatedRoute);
  private authService = inject(AccountService)
  statusMessage = 'Verifying your email...';

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (email && token) {
      this.authService.verifyEmail(email, token).subscribe({
        next: (user) => {
          if (user) {
            this.toasterService.success("Email verified successfully!",2000);
            setTimeout(() => {
              this.router.navigateByUrl('/members');
            }, 2000);
          }
        },
        error: () => {
          this.statusMessage = 'Verification link is invalid or expired.';
          this.toasterService.error("Invalid or expired verification link");
        }
      });
    } else {
      this.statusMessage = 'Invalid verification request.';
    }
  }
}
