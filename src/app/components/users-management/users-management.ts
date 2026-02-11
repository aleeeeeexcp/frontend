import { Component, OnInit, signal, computed } from '@angular/core';
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
  users = signal<UsersDto[]>([]);
  loading = signal(true);
  successMessage = signal('');
  errorMessage = signal('');
  
  showDeleteDialog = signal(false);
  userToDelete = signal<{ id: string; username: string } | null>(null);

  deleteMessage = computed(() => {
    const user = this.userToDelete();
    return user 
      ? `¿Estás seguro de eliminar el usuario "${user.username}"? Esta acción no se puede deshacer.`
      : '';
  });

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.users.set([]);
        this.loading.set(false);
      }
    });
  }

  deleteUser(userId: string, username: string) {
    this.userToDelete.set({ id: userId, username: username });
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (user) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.successMessage.set('Usuario eliminado correctamente');
          this.loadUsers();
          setTimeout(() => this.successMessage.set(''), 30);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.errorMessage.set('Error al eliminar el usuario');
          setTimeout(() => this.errorMessage.set(''), 30);
        }
      });
    }
    this.showDeleteDialog.set(false);
    this.userToDelete.set(null);
  }

  cancelDelete() {
    this.showDeleteDialog.set(false);
    this.userToDelete.set(null);
  }
}
