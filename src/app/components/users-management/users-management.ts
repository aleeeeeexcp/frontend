import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialog],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css'],
})
export class UsersManagement implements OnInit {
  users: UsersDto[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  
  showDeleteDialog = false;
  userToDelete: { id: string; username: string } | null = null;

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

  deleteUser(userId: string, username: string) {
    this.userToDelete = { id: userId, username: username };
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado correctamente';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.errorMessage = 'Error al eliminar el usuario';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
    this.showDeleteDialog = false;
    this.userToDelete = null;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.userToDelete = null;
  }

  get deleteMessage(): string {
    return this.userToDelete 
      ? `¿Estás seguro de eliminar el usuario "${this.userToDelete.username}"? Esta acción no se puede deshacer.`
      : '';
  }
}
