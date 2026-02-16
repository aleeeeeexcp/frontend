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
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ConfirmDialog],
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

  showConfirmDialogExpense = signal(false);
  showConfirmDialogIncome = signal(false);
  showConfirmDialogGroup = signal(false);
  expenseToDelete = signal<string | null>(null);
  incomeToDelete = signal<string | null>(null);
  groupToDelete = signal<string | null>(null);

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
      categoryId: [''],
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
    
    this.groupService.getUserGroups().subscribe({
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
    this.expenseToDelete.set(expenseId);
    this.showConfirmDialogExpense.set(true);
  }

  confirmDeleteExpense() {
    const expenseId = this.expenseToDelete();
    if (!expenseId) return;

    this.expenseService.deleteExpense(expenseId).subscribe({
      next: () => {
        this.successMessage.set('Gasto eliminado correctamente');
        this.loadExpenses();
        this.showConfirmDialogExpense.set(false);
        this.expenseToDelete.set(null);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al eliminar el gasto');
        this.showConfirmDialogExpense.set(false);
        this.expenseToDelete.set(null);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  cancelDeleteExpense() {
    this.showConfirmDialogExpense.set(false);
    this.expenseToDelete.set(null);
  }

  deleteGroup(groupId: string) {
    this.groupToDelete.set(groupId);
    this.showConfirmDialogGroup.set(true);
  }

  confirmDeleteGroup() {
    const groupId = this.groupToDelete();
    if (!groupId) return;
    this.groupService.deleteGroup(groupId).subscribe({
      next: () => {
        this.successMessage.set('Grupo eliminado correctamente');
        this.loadGroups();
        this.showConfirmDialogGroup.set(false);
        this.groupToDelete.set(null);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al eliminar el grupo');
        this.showConfirmDialogGroup.set(false);
        this.groupToDelete.set(null);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  cancelDeleteGroup() {
    this.showConfirmDialogGroup.set(false);
    this.groupToDelete.set(null);
  }

  deleteIncome(incomeId: string) {
    this.incomeToDelete.set(incomeId);
    this.showConfirmDialogIncome.set(true);
  }

  confirmDeleteIncome() {
    const incomeId = this.incomeToDelete();
    if (!incomeId) return;
    this.incomeService.deleteIncome(incomeId).subscribe({
      next: () => {
        this.successMessage.set('Ingreso eliminado correctamente');
        this.loadIncomes();
        this.showConfirmDialogIncome.set(false);
        this.incomeToDelete.set(null);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Error al eliminar el ingreso');
        this.showConfirmDialogIncome.set(false);
        this.incomeToDelete.set(null);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  cancelDeleteIncome() {
    this.showConfirmDialogIncome.set(false);
    this.incomeToDelete.set(null);
  }

  getCategoryName(categoryId?: string): string | null {
    if (!categoryId) return null;
    const category = this.categories().find(cat => cat.id === categoryId);
    return category ? category.name : null;
  }
}
