import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { GroupDto } from '../../models/group.model';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './groups-list.html',
  styleUrls: ['./groups-list.css']
})
export class GroupsList implements OnInit {
  groups = signal<GroupDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  deleteGroup(groupId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: () => {
          this.loadGroups();
        },
        error: (err) => {
          console.error('Error al eliminar grupo:', err);
          alert('No se pudo eliminar el grupo. Intenta nuevamente.');
        }
      });
    }
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
