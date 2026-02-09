import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  incomes: IncomeDto[] = [];
  loading = true;

  constructor(
    private incomeService: IncomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.loading = true;
    this.incomeService.getAllUsersIncomes().subscribe({
      next: (incomes) => {
        this.incomes = incomes || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar ingresos en lista:', err);
        this.incomes = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    }); 
  }
}
