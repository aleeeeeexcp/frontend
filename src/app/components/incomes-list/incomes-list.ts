import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeDto } from '../../models/income.model';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incomes-list.html',
  styleUrls: ['./incomes-list.css'],
})

export class IncomesList {
  incomes: IncomeDto[] = [];
  loading = true;

  constructor(private incomeService: IncomeService) {}

  ngOnInit() {
    this.incomeService.getAllUsersIncomes().subscribe({
      next: (incomes) => {
        this.incomes = incomes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    }); 
  }
}
