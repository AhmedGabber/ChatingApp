import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { loginCreds, registerCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { Register } from '../../features/account/register/register';
import { PresenceService } from './presence-service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { MemberService } from './member-service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private http = inject(HttpClient);
  protected presenceService = inject(PresenceService);
  currentUser = signal<User | null>(null);
  baseUrl = "https://localhost:7001/api/";

  register(creds: registerCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds)
  }

  verifyEmail(email: string, token: string) {
    return this.http.get<User>(`https://localhost:7001/api/account/verify-email?email=${email}&token=${token}`)
    .pipe(tap(user => {
      if (user) {
        this.setCurrentUser(user);
      }
    }));;
  }

  login(creds: loginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(tap(user => {
      if (user) {
        this.setCurrentUser(user);
      }
    }));
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected)
      this.presenceService.createHubConnetion(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
}
