import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseDto } from '../../models/expense.model';
import { CategoryDto } from '../../models/category.model';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmDialog],
  templateUrl: './expenses-list.html',
  styleUrls: ['./expenses-list.css'],
})
export class ExpensesList implements OnInit {

  expenses = signal<ExpenseDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  loading = signal(true);
  sortBy = signal<'date' | 'amount' | 'none'>('none');
  selectedCategoryId = signal('');
  expenseToDelete = signal<string | null>(null);
  showConfirmDialog = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses() {
    this.loading.set(true);
    this.sortBy.set('none');
    
    if (this.selectedCategoryId()) {
      this.expenseService.getAllUsersExpensesByCategory(this.selectedCategoryId()).subscribe({
        next: (expenses) => {
          this.expenses.set(expenses || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar gastos por categoría:', err);
          this.expenses.set([]);
          this.loading.set(false);
        }
      });
    } else {
      this.expenseService.getAllUsersExpenses().subscribe({
        next: (expenses) => {
          this.expenses.set(expenses || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar gastos en lista:', err);
          this.expenses.set([]);
          this.loading.set(false);
        }
      });
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories || []);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categories.set([]);
      }
    });
  }

  onCategoryChange(value: string) {
    this.selectedCategoryId.set(value);
    this.loadExpenses();
  }

  sortByDate() {
    this.loading.set(true);
    this.sortBy.set('date');
    
    if (this.selectedCategoryId()) {
      this.expenseService.getUsersExpensesByCategoryAndDateDesc(this.selectedCategoryId()).subscribe({
        next: (expenses) => {
          this.expenses.set(expenses || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al ordenar gastos por categoria y fecha:', err);
          this.loading.set(false);
        }
      });
    } else {
      this.expenseService.getUsersExpensesByDateDesc().subscribe({
        next: (expenses) => {
          this.expenses.set(expenses || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al ordenar gastos por fecha:', err);
          this.loading.set(false);
        }
      });
    }
  }

  sortByAmount() {
    this.loading.set(true);
    this.sortBy.set('amount');
    this.expenseService.getUsersExpensesByAmountDesc().subscribe({
      next: (expenses) => {
        this.expenses.set(expenses || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al ordenar gastos por precio:', err);
        this.loading.set(false);
      }
    });
  }

  getCategoryName(categoryId?: string): string | null {
    if (!categoryId) return null;
    const category = this.categories().find(cat => cat.id === categoryId);
    return category ? category.name : null;
  }

  deleteExpense(expenseId: string) {
    this.expenseToDelete.set(expenseId);
    this.showConfirmDialog.set(true);
  }

  confirmDeleteExpense() {
    const expenseId = this.expenseToDelete();
    if (!expenseId) return;

    this.expenseService.deleteExpense(expenseId).subscribe({
      next: () => {
        this.successMessage.set('Gasto eliminado correctamente');
        this.loadExpenses();
        this.showConfirmDialog.set(false);
        this.expenseToDelete.set(null);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al eliminar el gasto');
        this.showConfirmDialog.set(false);
        this.expenseToDelete.set(null);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  cancelDeleteExpense() {
    this.showConfirmDialog.set(false);
    this.expenseToDelete.set(null);
  }

}
