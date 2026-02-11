
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { ExpensesList } from './components/expenses-list/expenses-list';
import { IncomesList } from './components/incomes-list/incomes-list';
import { CreateExpense } from './components/create-expense/create-expense';
import { CreateIncome } from './components/create-income/create-income';
import { CreateGroup } from './components/create-group/create-group';
import { GroupsList } from './components/groups-list/groups-list';
import { GroupView } from './components/group-view/group-view';
import { UsersManagement } from './components/users-management/users-management';
import { CategoriesManagement } from './components/categories-management/categories-management';
import { CreateCategory } from './components/create-category/create-category';
import { ChangePassword } from './components/change-password/change-password';
import { UserProfile } from './components/user-profile/user-profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'expenses', component: ExpensesList },
  { path: 'incomes', component: IncomesList },
  { path: 'create-expense', component: CreateExpense },
  { path: 'create-income', component: CreateIncome },
  { path: 'create-group', component: CreateGroup },
  { path: 'groups', component: GroupsList },
  { path: 'groups/:id', component: GroupView },
  { path: 'users', component: UsersManagement },
  { path: 'categories', component: CategoriesManagement },
  { path: 'create-category', component: CreateCategory },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'change-password', component: ChangePassword },
  { path: 'profile', component: UserProfile }
];

