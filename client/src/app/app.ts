import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Nav } from '../layout/nav/nav';


@Component({
  selector: 'app-root',
  imports: [ Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected router = inject(Router);


}
