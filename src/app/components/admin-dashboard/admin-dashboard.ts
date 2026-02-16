import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { UsersDto } from '../../models/user.model';
import { CategoryDto } from '../../models/category.model';
import { GroupDto } from '../../models/group.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  users = signal<UsersDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  groups = signal<GroupDto[]>([]);
  
  loadingUsers = signal(true);
  loadingCategories = signal(true);
  loadingGroups = signal(true);

  adminCount = computed(() => 
    this.users().filter(u => u.roleType === 'ADMIN').length
  );

  userCount = computed(() => 
    this.users().filter(u => u.roleType !== 'ADMIN').length
  );

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCategories();
    this.loadGroups();
  }

  loadUsers() {
    this.loadingUsers.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users || []);
        this.loadingUsers.set(false);
      },
      error: (err) => {
        console.error('✗ Error al cargar usuarios:', err);
        this.users.set([]);
        this.loadingUsers.set(false);
      }
    });
  }

  loadCategories() {
    this.loadingCategories.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories || []);
        this.loadingCategories.set(false);
      },
      error: (err) => {
        console.error('✗ Error al cargar categorías:', err);
        this.categories.set([]);
        this.loadingCategories.set(false);
      }
    });
  }

  loadGroups() {
    this.loadingGroups.set(true);
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups || []);
        this.loadingGroups.set(false);
      },
      error: (err) => {
        console.error('✗ Error al cargar grupos:', err);
        this.groups.set([]);
        this.loadingGroups.set(false);
      }
    });
  }
}
