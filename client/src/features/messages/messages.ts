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
  private route = inject(ActivatedRoute);
  protected messageService = inject(MessageService);
  protected member = signal<Member | undefined>(undefined);
  protected messageContent = '';
  protected content = '';
  protected memberId = '';
  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    })
  }
  @ViewChild('messageEndRef') private messageEndRef!: ElementRef;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const otherId = params.get('id');
      if (otherId) {
        this.memberId = otherId;
        if (this.messageService.hubConnection) {
          this.messageService.stopHubConnection();
        }
        this.messageService.createHubConnection(otherId);
      }
    });

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

  deleteMessage(event: Event, id: string) {

    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {

        this.messageService.messageThread.update(messages => messages.filter(msg => msg.id !== id));
      },
      error: err => {
        console.error('Error deleting message:', err);
      }
    });
  }

  async sendMessage() {
    if (this.messageContent.length > 150) return;
    if (!this.memberId || !this.messageContent.trim()) return;

    this.content = this.messageContent;
    this.messageContent = '';
    await this.messageService.sendMessage(this.memberId, this.content);
    this.content = '';
  }

}
