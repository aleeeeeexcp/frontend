import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseDto } from '../models/expense.model';


@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/expenses';
  private token = localStorage.getItem('token'); 
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  getAllUsersExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(this.apiUrl, { headers: this.headers });
  }

  getAllUsersExpensesByCategory(categoryId: string): Observable<ExpenseDto[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/byCategory`, { params, headers: this.headers });
  }

  createExpense(expense: ExpenseDto): Observable<ExpenseDto> {
    return this.http.post<ExpenseDto>(`${this.apiUrl}/createExpense`, expense, { headers: this.headers });
  }

  deleteExpense(expenseId: string): Observable<void> {
    const params = new HttpParams().set('expenseId', expenseId);
    return this.http.delete<void>(`${this.apiUrl}/delete`, { params, headers: this.headers });
  }
}
