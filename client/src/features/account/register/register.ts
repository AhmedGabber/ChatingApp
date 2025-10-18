import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private toster = inject(ToastService);

  protected creds = {} as registerCreds;
  protected confirmPassword: string = '';
  protected showPassword: boolean = false;
  protected cancelRegister = output<boolean>();

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (this.creds.password !== this.confirmPassword) {
      this.toster.error("Passwords do not match",2000);
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{4,}$/;
    if (!passwordPattern.test(this.creds.password)) {
      this.toster.error("Password must have at least one uppercase letter and one special character",2000);
      return;
    }

    this.accountService.register(this.creds).subscribe({
      next: () => {
        this.toster.info("Check your email to verify your account", 2000);
        this.router.navigateByUrl('/verify-email');
      },
      error: () => {
        this.toster.error("This email is already used");
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
