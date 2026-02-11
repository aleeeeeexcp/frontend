import { Component, signal, HostListener } from '@angular/core';
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
  isDropdownOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.nav-item.dropdown');
    
    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  isHomePage(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/home' || url === '/login' || url === '/register';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeDropdown();
  }
}
