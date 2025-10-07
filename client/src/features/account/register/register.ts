import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected creds = {} as registerCreds
  private accountService = inject(AccountService);
  protected cancelRegister=output<boolean>();
  
  register() {
    this.accountService.register(this.creds).subscribe({
      next: response => {
        console.log(response),
          this.creds = {
            email: '',
            displayName: '',
            password: ''
          };

      },
      error: error => {
        alert(error.message);
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
