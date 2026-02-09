import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(public authService: AuthService, private router: Router) {}

  isHomePage(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/home' || url === '/login' || url === '/register';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
