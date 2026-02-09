import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseDto } from '../../models/expense.model';
import { CategoryDto } from '../../models/category.model';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './expenses-list.html',
  styleUrls: ['./expenses-list.css'],
})
export class ExpensesList implements OnInit {

  expenses: ExpenseDto[] = [];
  categories: CategoryDto[] = [];
  loading = true;
  sortBy: 'date' | 'amount' | 'none' = 'none';
  selectedCategoryId: string = '';

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses() {
    this.loading = true;
    this.sortBy = 'none';
    
    if (this.selectedCategoryId) {
      this.expenseService.getAllUsersExpensesByCategory(this.selectedCategoryId).subscribe({
        next: (expenses) => {
          this.expenses = expenses || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar gastos por categoría:', err);
          this.expenses = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.expenseService.getAllUsersExpenses().subscribe({
        next: (expenses) => {
          this.expenses = expenses || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar gastos en lista:', err);
          this.expenses = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categories = [];
      }
    });
  }

  onCategoryChange() {
    this.loadExpenses();
  }

  sortByDate() {
    this.loading = true;
    this.sortBy = 'date';
    
    if (this.selectedCategoryId) {
      this.expenseService.getUsersExpensesByCategoryAndDateDesc(this.selectedCategoryId).subscribe({
        next: (expenses) => {
          this.expenses = expenses || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al ordenar gastos por categoria y fecha:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.expenseService.getUsersExpensesByDateDesc().subscribe({
        next: (expenses) => {
          this.expenses = expenses || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al ordenar gastos por fecha:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  sortByAmount() {
    this.loading = true;
    this.sortBy = 'amount';
    this.expenseService.getUsersExpensesByAmountDesc().subscribe({
      next: (expenses) => {
        this.expenses = expenses || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al ordenar gastos por precio:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
