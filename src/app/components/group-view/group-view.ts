import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { ExpenseDto } from '../../models/expense.model';
import { IncomeDto } from '../../models/income.model';
import { GroupDto } from '../../models/group.model';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './group-view.html',
  styleUrls: ['./group-view.css'],
})
export class GroupView implements OnInit {
  groupId: string = '';
  group: GroupDto | null = null;
  expenses: ExpenseDto[] = [];
  incomes: IncomeDto[] = [];
  loadingExpenses = true;
  loadingIncomes = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    if (this.groupId) {
      this.loadGroupData();
    }
  }

  loadGroupData() {
    this.loadExpenses();
    this.loadIncomes();
  }

  loadExpenses() {
    this.loadingExpenses = true;
    this.groupService.getExpensesByGroup(this.groupId).subscribe({
      next: (expenses) => {
        this.expenses = expenses || [];
        this.loadingExpenses = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar gastos del grupo:', err);
        this.errorMessage = 'Error al cargar gastos del grupo';
        this.expenses = [];
        this.loadingExpenses = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadIncomes() {
    this.loadingIncomes = true;
    this.groupService.getIncomesByGroup(this.groupId).subscribe({
      next: (incomes) => {
        this.incomes = incomes || [];
        this.loadingIncomes = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar ingresos del grupo:', err);
        this.errorMessage = 'Error al cargar ingresos del grupo';
        this.incomes = [];
        this.loadingIncomes = false;
        this.cdr.detectChanges();
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
}
