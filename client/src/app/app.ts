import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { Register } from "../features/account/register/register";
import { User } from '../types/user';
import { lastValueFrom } from 'rxjs';
import { Home } from "../features/home/home";

@Component({
  selector: 'app-root',
  imports: [ Nav, Register, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected readonly title = 'Chat App';
  protected members= signal<User[]>([]);

  async ngOnInit() {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser(){
   const userString=localStorage.getItem('user');
   if(!userString) return;
   const user=JSON.parse(userString);
   this.accountService.currentUser.set(user);
  }

  async getMembers(){
    try{
      return lastValueFrom(this.http.get<User[]>('https://localhost:7001/api/members'));
    }
     catch(error){
      console.log(error);
      return [];
    }

  }

}
