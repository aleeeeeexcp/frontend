import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { GroupDto } from '../../models/group.model';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialog],
  templateUrl: './groups-list.html',
  styleUrls: ['./groups-list.css']
})
export class GroupsList implements OnInit {
  groups = signal<GroupDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  
  showDeleteDialog = signal(false);
  groupToDelete = signal<{ id: string; name: string } | null>(null);

  isAdmin = computed(() => this.authService.isAdmin());
  dashboardRoute = computed(() => this.isAdmin() ? '/admin-dashboard' : '/dashboard');

  deleteMessage = computed(() => {
    const group = this.groupToDelete();
    if (!group) return '';
    
    if (this.isAdmin()) {
      return `¿Estás seguro de eliminar permanentemente el grupo "${group.name}"? Esta acción eliminará el grupo para todos los usuarios y no se puede deshacer.`;
    } else {
      return `¿Estás seguro de salir del grupo "${group.name}"? Esta acción no se puede deshacer.`;
    }
  });

  constructor(
    private groupService: GroupService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading.set(true);
    const isAdmin = this.authService.isAdmin();
    
    // Si es admin, cargar todos los grupos; si no, solo los del usuario
    const groupsObservable = isAdmin 
      ? this.groupService.getAllGroups()
      : this.groupService.getUserGroups();
    
    groupsObservable.subscribe({
      next: (groups) => {
        this.groups.set(groups || []);
        this.loading.set(false);
      },
      error:  (err) => {
        this.errorMessage.set('Error al cargar los grupos. Intenta nuevamente.');
        this.groups.set([]);
        this.loading.set(false);
      }
    });
  }

  deleteGroup(groupId: string, groupName: string) {
    this.groupToDelete.set({ id: groupId, name: groupName });
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
    const group = this.groupToDelete();
    if (group) {
      // Si es admin, elimina el grupo completamente; si no, sale del grupo
      const deleteObservable = this.isAdmin() 
        ? this.groupService.deleteGroup(group.id)
        : this.groupService.leaveGroup(group.id);
      
      deleteObservable.subscribe({
        next: () => {
          this.loadGroups();
        },
        error: (err) => {
          console.error('Error al eliminar grupo:', err);
          this.errorMessage.set('No se pudo eliminar el grupo. Intenta nuevamente.');
          setTimeout(() => this.errorMessage.set(''), 30);
        }
      });
    }
    this.showDeleteDialog.set(false);
    this.groupToDelete.set(null);
  }

  cancelDelete() {
    this.showDeleteDialog.set(false);
    this.groupToDelete.set(null);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  viewGroup(groupId: string) {
    this.router.navigate(['/groups', groupId]);
  }
}
