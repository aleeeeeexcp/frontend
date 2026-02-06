
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesList } from './components/expenses-list/expenses-list';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'dashboard', component: DashboardComponent, children: [
         {path: 'expenses', component: ExpensesList}
    ] } ,
    { path: 'login', component: Login },
    { path: 'register', component: Register }
];

