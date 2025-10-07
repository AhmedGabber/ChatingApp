import { CanActivateFn } from '@angular/router';
import { ToastService } from '../services/toast-service';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);

  if (accountService.currentUser()) return true;
  else {
    toastService.error('you shall not pass!!!', 10000 );
    return false;
  }
};
