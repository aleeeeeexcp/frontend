import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  groups: GroupDto[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private groupService: GroupService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading = true;
    this.groupService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error:  (err) => {
        this.errorMessage = 'Error al cargar los grupos. Intenta nuevamente.';
        this.groups = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
