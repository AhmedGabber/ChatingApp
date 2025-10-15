import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { MessageService } from '../../core/services/message-servic';
import { Member } from '../../types/member';
import { Message, MessageSend } from '../../types/message';
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
  protected messageImage: string | ArrayBuffer | null = null;
  message: MessageSend = {
    recipientId: '',
    content: '',
    messageType: 0
  }

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
        this.message.recipientId = otherId;
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

  openModal() {
    this.messageContent = '';
    const dialog = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (dialog) dialog.showModal();
  }

  closeModal() {
    this.messageImage = ''
    const dialog = document.getElementById('my_modal_3') as HTMLDialogElement;
    const fileInput = dialog?.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (dialog) dialog.close();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.messageImage = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

cleanBase64(base64String: string): string {
  // Decodes a base64 string in the browser
  try {
    return atob(base64String);
  } catch (e) {
    console.error('Invalid base64 string:', e);
    return '';
  }
}

  async sendMessage() {
    if (this.messageContent.length > 150) return;
    if (!this.message.recipientId ) return;
    if ((!this.messageImage || (typeof this.messageImage === 'string' && this.messageImage.length === 0)) &&
    (!this.messageContent || this.messageContent.trim().length === 0)) {
    return; 
  }
    const image = this.messageImage;
    const content = this.messageContent;

    if (image) {
      this.message.content = typeof image === 'string' ? image : new TextDecoder().decode(image);
      this.message.messageType = 1
      this.closeModal();
    }
    else {
      this.message.content = this.messageContent;
      this.message.messageType = 0;
    }

    this.messageContent = '';
    await this.messageService.sendMessage(this.message);

  }


}
