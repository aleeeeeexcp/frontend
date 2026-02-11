import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { UsersDto } from '../../models/user.model';
import { CategoryDto } from '../../models/category.model';

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
  
  loadingUsers = signal(true);
  loadingCategories = signal(true);

  adminCount = computed(() => 
    this.users().filter(u => u.roleType === 'ADMIN').length
  );

  userCount = computed(() => 
    this.users().filter(u => u.roleType !== 'ADMIN').length
  );

  constructor(
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCategories();
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
}
