import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryDto } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialog],
  templateUrl: './categories-management.html',
  styleUrls: ['./categories-management.css'],
})
export class CategoriesManagement implements OnInit {
  categories: CategoryDto[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  
  showDeleteDialog = false;
  categoryToDelete: { id: string; name: string } | null = null;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categories = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(categoryId: string, categoryName: string) {
    this.categoryToDelete = { id: categoryId, name: categoryName };
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Categoría eliminada correctamente';
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          this.errorMessage = 'Error al eliminar la categoría';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
    this.showDeleteDialog = false;
    this.categoryToDelete = null;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.categoryToDelete = null;
  }

  get deleteMessage(): string {
    return this.categoryToDelete 
      ? `¿Estás seguro de eliminar la categoría "${this.categoryToDelete.name}"? Esta acción no se puede deshacer.`
      : '';
  }
}
