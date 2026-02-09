import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseDto } from '../models/expense.model';


@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/expenses';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsersExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAllUsersExpensesByCategory(categoryId: string): Observable<ExpenseDto[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/byCategory`, { params, headers: this.getHeaders() });
  }

  createExpense(expense: ExpenseDto): Observable<ExpenseDto> {
    return this.http.post<ExpenseDto>(`${this.apiUrl}/createExpense`, expense, { headers: this.getHeaders() });
  }

  deleteExpense(expenseId: string): Observable<void> {
    const params = new HttpParams().set('expenseId', expenseId);
    return this.http.delete<void>(`${this.apiUrl}/delete`, { params, headers: this.getHeaders() });
  }

  getUsersExpensesByAmountDesc() : Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/sortedByAmount`, { headers: this.getHeaders() });
  }

  getUsersExpensesByDateDesc() : Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/sortedByDate`, { headers: this.getHeaders() });
  }

  getUsersExpensesByCategoryAndDateDesc(categoryId: string) : Observable<ExpenseDto[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/byCategory/sortedByDate`, { params, headers: this.getHeaders() });
  }

  getUsersExpensesByCategoryAndAmountDesc(categoryId: string) : Observable<ExpenseDto[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<ExpenseDto[]>(`${this.apiUrl}/byCategory/sortedByAmount`, { params, headers: this.getHeaders() });
  }
}
