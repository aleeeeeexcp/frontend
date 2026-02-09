import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { CategoryService } from '../../services/category.service';
import { ExpenseDto } from '../../models/expense.model';
import { IncomeDto } from '../../models/income.model';
import { CategoryDto } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  expenses: ExpenseDto[] = [];
  incomes: IncomeDto[] = [];
  categories: CategoryDto[] = [];
  
  loadingExpenses = true;
  loadingIncomes = true;
  loadingCategories = true;
  
  showExpenseForm = false;
  showIncomeForm = false;
  
  expenseForm: FormGroup;
  incomeForm: FormGroup;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
    
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadExpenses();
    this.loadIncomes();
    this.loadCategories();
  }

  loadExpenses() {
    this.loadingExpenses = true;

    this.expenseService.getAllUsersExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses || [];
        this.loadingExpenses = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = `Error al cargar gastos: ${err.status === 0 ? 'Backend no disponible' : err.message}`;
        this.expenses = [];
        this.loadingExpenses = false;
        this.cdr.detectChanges();
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  loadIncomes() {
    this.loadingIncomes = true;
    this.incomeService.getAllUsersIncomes().subscribe({
      next: (incomes) => {
        this.incomes = incomes || [];
        this.loadingIncomes = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = `Error al cargar ingresos: ${err.status === 0 ? 'Backend no disponible' : err.message}`;
        this.incomes = [];
        this.loadingIncomes = false;
        this.cdr.detectChanges();
        setTimeout(() => this.errorMessage = '', 5000);
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
        this.errorMessage = `Error al cargar categorías: ${err.status === 0 ? 'Backend no disponible' : err.message}`;
        this.categories = [];
        this.loadingCategories = false;
        this.cdr.detectChanges();
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  get totalExpenses(): number {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  get totalIncomes(): number {
    return this.incomes.reduce((sum, inc) => sum + inc.amount, 0);
  }

  get balance(): number {
    return this.totalIncomes - this.totalExpenses;
  }

  get displayedExpenses(): ExpenseDto[] {
    return this.expenses.slice(0, 3);
  }

  get displayedIncomes(): IncomeDto[] {
    return this.incomes.slice(0, 3);
  }

  toggleExpenseForm() {
    this.showExpenseForm = !this.showExpenseForm;
    this.showIncomeForm = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  toggleIncomeForm() {
    this.showIncomeForm = !this.showIncomeForm;
    this.showExpenseForm = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  submitExpense() {
    if (this.expenseForm.invalid) return;
    
    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage = 'Gasto creado correctamente';
        this.expenseForm.reset();
        this.showExpenseForm = false;
        this.loadExpenses();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el gasto';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  submitIncome() {
    if (this.incomeForm.invalid) return;
    
    this.incomeService.createIncome(this.incomeForm.value).subscribe({
      next: () => {
        this.successMessage = 'Ingreso creado correctamente';
        this.incomeForm.reset();
        this.showIncomeForm = false;
        this.loadIncomes();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el ingreso';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  deleteExpense(expenseId: string) {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      this.expenseService.deleteExpense(expenseId).subscribe({
        next: () => {
          this.successMessage = 'Gasto eliminado correctamente';
          this.loadExpenses();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar el gasto';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
