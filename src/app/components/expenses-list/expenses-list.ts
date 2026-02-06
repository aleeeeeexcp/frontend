import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseDto } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenses-list.html',
  styleUrls: ['./expenses-list.css'],
})
export class ExpensesList {

  expenses: ExpenseDto[] = [];
  loading = true;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.getAllUsersExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
