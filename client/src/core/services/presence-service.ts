import { inject, Injectable } from '@angular/core';
import { ToastService } from './toast-service';
import { User } from '../../types/user';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private baseHub = 'https://localhost:7001/hubs/';
  private toaster = inject(ToastService);
  hubConnection?: HubConnection

  createHubConnetion(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.baseHub + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect().build();


    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserOnline', email => {
      this.toaster.success(email + ' has connected');
    })

    this.hubConnection.on('UserOffline', email => {
      this.toaster.info(email + ' has disconnected');
    })
  }


  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected )
      this.hubConnection.stop().catch(error=> console.log(error))
  }
}
