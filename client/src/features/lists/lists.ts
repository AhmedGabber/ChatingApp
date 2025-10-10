import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-servic';
import { Member } from '../../types/member';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-lists',
  imports: [RouterLink],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
 private messagesService=inject(MessageService);
 protected membersChatList = signal<Member[]>([]);

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.messagesService.getMessagesList().subscribe({
      next: responce => this.membersChatList.set(responce)
    })
  }

}
