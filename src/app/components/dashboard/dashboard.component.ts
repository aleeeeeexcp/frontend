import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent{
  showOutlet = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToExpenses() {
    this.router.navigate(['expenses'], { relativeTo: this.route });
  }

  goToIncomes() {
    this.router.navigate(['incomes'], { relativeTo: this.route });
  }

  createExpense() {
    this.router.navigate(['create-expense'], { relativeTo: this.route });
  }

  createIncome() {
    this.router.navigate(['create-income'], { relativeTo: this.route });
  }

}
