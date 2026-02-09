import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css'],
})
export class UsersManagement implements OnInit {
  users: UsersDto[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.users = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
