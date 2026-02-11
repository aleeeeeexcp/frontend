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

  constructor(
    private incomeService: IncomeService
  ) {}

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.loading.set(true);
    this.incomeService.getAllUsersIncomes().subscribe({
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
}
