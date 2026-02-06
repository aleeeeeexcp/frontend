import { Component} from '@angular/core';
import { ExpensesList } from '../expenses-list/expenses-list';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ExpensesList, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent{
  
  selected: 'expenses' | 'incomes' | null = null;
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  goToExpenses() {
    this.router.navigate(['expenses'], { relativeTo: this.route });
  }
}
