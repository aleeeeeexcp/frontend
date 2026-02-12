import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  categories = signal<CategoryDto[]>([]);
  loading = signal(true);
  successMessage = signal('');
  errorMessage = signal('');
  
  showDeleteDialog = signal(false);
  categoryToDelete = signal<{ id: string; name: string } | null>(null);

  deleteMessage = computed(() => {
    const category = this.categoryToDelete();
    return category 
      ? `¿Estás seguro de eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`
      : '';
  });

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categories.set([]);
        this.loading.set(false);
      }
    });
  }

  deleteCategory(categoryId: string, categoryName: string) {
    this.categoryToDelete.set({ id: categoryId, name: categoryName });
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
    const category = this.categoryToDelete();
    if (category) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.successMessage.set('Categoría eliminada correctamente');
          this.loadCategories();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          this.errorMessage.set('Error al eliminar la categoría');
          setTimeout(() => this.errorMessage.set(''), 3000);
        }
      });
    }
    this.showDeleteDialog.set(false);
    this.categoryToDelete.set(null);
  }

  cancelDelete() {
    this.showDeleteDialog.set(false);
    this.categoryToDelete.set(null);
  }

  editCategory(category: CategoryDto) {
    this.router.navigate(['/create-category'], { state: { category } });
  }
}
