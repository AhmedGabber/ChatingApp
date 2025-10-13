import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private router = inject(Router)
  private accountService = inject(AccountService);
  protected creds = {} as registerCreds
  protected cancelRegister=output<boolean>();
  private toster = inject(ToastService)
  register() {
    this.accountService.register(this.creds).subscribe({
      next: response => {this.router.navigateByUrl('/members');
        console.log(response),
          this.creds = {
            email: '',
            displayName: '',
            password: ''
          };

      },
      error: error => {
        this.toster.error("This mail is already used")
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
