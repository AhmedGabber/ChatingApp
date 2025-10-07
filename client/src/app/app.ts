import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = 'Chating App';
  protected members= signal<any>([]);

  ngOnInit(): void {
    this.http.get('https://localhost:7001/api/members').subscribe({
      next: (result) => {
        this.members.set(result);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

  }

}
