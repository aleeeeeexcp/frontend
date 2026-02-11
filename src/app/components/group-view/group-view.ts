import { Component, OnInit, signal, computed } from '@angular/core';
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
  groupId = signal('');
  group = signal<GroupDto | null>(null);
  expenses = signal<ExpenseDto[]>([]);
  incomes = signal<IncomeDto[]>([]);
  loadingExpenses = signal(true);
  loadingIncomes = signal(true);
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

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.groupId.set(id);
    if (id) {
      this.loadGroupData();
    }
  }

  loadGroupData() {
    this.loadExpenses();
    this.loadIncomes();
  }

  loadExpenses() {
    this.loadingExpenses.set(true);
    this.groupService.getExpensesByGroup(this.groupId()).subscribe({
      next: (expenses) => {
        this.expenses.set(expenses || []);
        this.loadingExpenses.set(false);
      },
      error: (err) => {
        console.error('Error al cargar gastos del grupo:', err);
        this.errorMessage.set('Error al cargar gastos del grupo');
        this.expenses.set([]);
        this.loadingExpenses.set(false);
      }
    });
  }

  loadIncomes() {
    this.loadingIncomes.set(true);
    this.groupService.getIncomesByGroup(this.groupId()).subscribe({
      next: (incomes) => {
        this.incomes.set(incomes || []);
        this.loadingIncomes.set(false);
      },
      error: (err) => {
        console.error('Error al cargar ingresos del grupo:', err);
        this.errorMessage.set('Error al cargar ingresos del grupo');
        this.incomes.set([]);
        this.loadingIncomes.set(false);
      }
    });
  }
}
