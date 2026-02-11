import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { ExpenseDto } from '../../models/expense.model';
import { IncomeDto } from '../../models/income.model';
import { CategoryDto } from '../../models/category.model';
import { GroupDto } from '../../models/group.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  expenses = signal<ExpenseDto[]>([]);
  incomes = signal<IncomeDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  groups = signal<GroupDto[]>([]);
  
  loadingExpenses = signal(true);
  loadingIncomes = signal(true);
  loadingCategories = signal(true);
  loadingGroups = signal(true);
  
  showExpenseForm = signal(false);
  showIncomeForm = signal(false);
  
  expenseForm: FormGroup;
  incomeForm: FormGroup;
  
  successMessage = signal('');
  errorMessage = signal('');

  totalExpenses = computed(() => 
    this.expenses().reduce((sum, exp) => sum + exp.amount, 0)
  );

  totalIncomes = computed(() => 
    this.incomes().reduce((sum, inc) => sum + inc.amount, 0)
  );

  balance = computed(() => 
    this.totalIncomes() - this.totalExpenses()
  );

  displayedExpenses = computed(() => 
    this.expenses().slice(0, 3)
  );

  displayedIncomes = computed(() => 
    this.incomes().slice(0, 3)
  );

  displayedGroups = computed(() => 
    this.groups().slice(0, 3)
  );

  constructor(
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      categoryId: ['', Validators.required],
      groupId: ['']
    });
    
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      groupId: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses();
    this.loadIncomes();
    this.loadCategories();
    this.loadGroups();
  }

  loadExpenses() {
    this.loadingExpenses.set(true);

    this.expenseService.getAllUsersExpenses().subscribe({
      next: (expenses) => {
        this.expenses.set(expenses || []);
        this.loadingExpenses.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Error al cargar gastos: ${err.status === 0 ? 'Backend no disponible' : err.message}`);
        this.expenses.set([]);
        this.loadingExpenses.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  loadIncomes() {
    this.loadingIncomes.set(true);
    this.incomeService.getAllUsersIncomes().subscribe({
      next: (incomes) => {
        this.incomes.set(incomes || []);
        this.loadingIncomes.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Error al cargar ingresos: ${err.status === 0 ? 'Backend no disponible' : err.message}`);
        this.incomes.set([]);
        this.loadingIncomes.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
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
        this.errorMessage.set(`Error al cargar categorías: ${err.status === 0 ? 'Backend no disponible' : err.message}`);
        this.categories.set([]);
        this.loadingCategories.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
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
        this.errorMessage.set(`Error al cargar grupos: ${err.status === 0 ? 'Backend no disponible' : err.message}`);
        this.groups.set([]);
        this.loadingGroups.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  toggleExpenseForm() {
    this.showExpenseForm.set(!this.showExpenseForm());
    this.showIncomeForm.set(false);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  toggleIncomeForm() {
    this.showIncomeForm.set(!this.showIncomeForm());
    this.showExpenseForm.set(false);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  submitExpense() {
    if (this.expenseForm.invalid) return;
    
    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage.set('Gasto creado correctamente');
        this.expenseForm.reset();
        this.showExpenseForm.set(false);
        this.loadExpenses();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al crear el gasto');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  submitIncome() {
    if (this.incomeForm.invalid) return;
    
    this.incomeService.createIncome(this.incomeForm.value).subscribe({
      next: () => {
        this.successMessage.set('Ingreso creado correctamente');
        this.incomeForm.reset();
        this.showIncomeForm.set(false);
        this.loadIncomes();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al crear el ingreso');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  deleteExpense(expenseId: string) {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      this.expenseService.deleteExpense(expenseId).subscribe({
        next: () => {
          this.successMessage.set('Gasto eliminado correctamente');
          this.loadExpenses();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          this.errorMessage.set('Error al eliminar el gasto');
          setTimeout(() => this.errorMessage.set(''), 3000);
        }
      });
    }
  }
}
