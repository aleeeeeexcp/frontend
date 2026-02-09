
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesList } from './components/expenses-list/expenses-list';
import { IncomesList } from './components/incomes-list/incomes-list';
import { CreateExpense } from './components/create-expense/create-expense';
import { CreateIncome } from './components/create-income/create-income';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/expenses', component: ExpensesList },
  { path: 'dashboard/incomes', component: IncomesList },
  { path: 'dashboard/create-expense', component: CreateExpense },
  { path: 'dashboard/create-income', component: CreateIncome },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

