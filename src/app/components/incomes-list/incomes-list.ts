import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncomeDto } from '../../models/income.model';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './incomes-list.html',
  styleUrls: ['./incomes-list.css'],
})

export class IncomesList implements OnInit {
  incomes = signal<IncomeDto[]>([]);
  loading = signal(true);
  sortBy = signal<'default' | 'amount' | 'date'>('default');

  constructor(
    private incomeService: IncomeService
  ) {}

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.loading.set(true);
    let request$;
    
    switch(this.sortBy()) {
      case 'amount':
        request$ = this.incomeService.getAllUsersIncomesSortedByAmount();
        break;
      case 'date':
        request$ = this.incomeService.getAllUsersIncomesSortedByDate();
        break;
      default:
        request$ = this.incomeService.getAllUsersIncomes();
    }

    request$.subscribe({
      next: (incomes) => {
        this.incomes.set(incomes || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar ingresos en lista:', err);
        this.incomes.set([]);
        this.loading.set(false);
      }
    }); 
  }

  changeSortBy(sort: 'default' | 'amount' | 'date') {
    this.sortBy.set(sort);
    this.loadIncomes();
  }
}
