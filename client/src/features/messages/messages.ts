import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { MessageService } from '../../core/services/message-servic';
import { Member } from '../../types/member';
import { Message } from '../../types/message';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  imports: [DatePipe, FormsModule, CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit, AfterViewInit {
  private messageService = inject(MessageService);
  protected messages = signal<Message[]>([]);
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);
  protected messageContent = '';
  protected memberId = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    })
  }
  @ViewChild('messageEndRef') private messageEndRef!: ElementRef;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.memberId = id;
      }
    });
    this.loadMessage();
  }

  ngAfterViewInit(): void {

    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      setTimeout(() =>
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' })
      )
    } catch (err) { }
  }

  loadMessage() {
    if (this.memberId) {
      this.messageService.getMessagesThread(this.memberId).subscribe({
        next: message => {
          this.messages.set(message.map(msg => ({
            ...msg,
            currentUserSender: msg.senderId !== this.memberId
          })));
          this.scrollToBottom();
        }
      })
    }
  }
  deleteMessage(event: Event, id: string) {
  
    event.stopPropagation();

    
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
      
        this.messages.update(messages => messages.filter(msg => msg.id !== id));
      },
      error: err => {
        console.error('Error deleting message:', err);
      }
    });
  }
  sendMessage() {
    if (this.messageContent.length > 150) {
      return;
    }
    if (!this.memberId || !this.messageContent.trim()) {
      return;
    }

    this.messageService.sendMessage(this.memberId, this.messageContent).subscribe({
      next: message => {
        message.currentUserSender = true;

        this.messages.update(messages => [...messages, message]);

        this.messageContent = '';

        this.scrollToBottom();
      }
    });
  }
}
