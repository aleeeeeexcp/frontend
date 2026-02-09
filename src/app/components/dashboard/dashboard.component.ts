import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent{
  showOutlet = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToExpenses() {
    this.router.navigate(['/dashboard/expenses']);
  }

  goToIncomes() {
    this.router.navigate(['/dashboard/incomes']);
  }

  createExpense() {
    this.router.navigate(['/dashboard/create-expense']);
  }

  createIncome() {
    this.router.navigate(['/dashboard/create-income']);
  }

}
