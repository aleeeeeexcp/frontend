import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { GroupDto } from '../../models/group.model';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

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

  deleteMessage = computed(() => {
    const group = this.groupToDelete();
    return group 
      ? `¿Estás seguro de eliminar el grupo "${group.name}"? Esta acción no se puede deshacer.`
      : '';
  });

  constructor(
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading.set(true);
    this.groupService.getUserGroups().subscribe({
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
      this.groupService.deleteGroup(group.id).subscribe({
        next: () => {
          this.loadGroups();
        },
        error: (err) => {
          console.error('Error al eliminar grupo:', err);
          this.errorMessage.set('No se pudo eliminar el grupo. Intenta nuevamente.');
          setTimeout(() => this.errorMessage.set(''), 3000);
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
