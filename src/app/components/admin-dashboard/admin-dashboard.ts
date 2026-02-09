import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  users: UsersDto[] = [];
  categories: CategoryDto[] = [];
  
  loadingUsers = true;
  loadingCategories = true;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCategories();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('✗ Error al cargar usuarios:', err);
        this.users = [];
        this.loadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('✗ Error al cargar categorías:', err);
        this.categories = [];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  get adminCount(): number {
    return this.users.filter(u => u.roleType === 'ADMIN').length;
  }

  get userCount(): number {
    return this.users.filter(u => u.roleType !== 'ADMIN').length;
  }
}
