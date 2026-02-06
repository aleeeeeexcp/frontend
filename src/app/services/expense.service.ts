import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseDto } from '../models/expense.model';


@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = '/api/expenses';

  constructor(private http: HttpClient) {}

  getAllUsersExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(this.apiUrl);
  }

  getAllUsersExpensesByCategory(categoryId: string): Observable<ExpenseDto[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/byCategory`, { params });
  }

  createExpense(expense: ExpenseDto): Observable<ExpenseDto> {
    return this.http.post<ExpenseDto>(`${this.apiUrl}/createExpense`, expense);
  }

  deleteExpense(expenseId: string): Observable<void> {
    const params = new HttpParams().set('expenseId', expenseId);
    return this.http.delete<void>(`${this.apiUrl}/delete`, { params });
  }
}
