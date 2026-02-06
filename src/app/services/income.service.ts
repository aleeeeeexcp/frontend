import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeDto } from '../models/income.model';


@Injectable({
  providedIn: 'root',
})

export class IncomeService {
  private apiUrl = 'http://localhost:8080/api/incomes';
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  
  constructor(private http: HttpClient) {}

  getAllUsersIncomes(): Observable<IncomeDto[]> {
    return this.http.get<IncomeDto[]>(this.apiUrl, { headers: this.headers });
  }

  createIncome(income: IncomeDto): Observable<IncomeDto> {
    return this.http.post<IncomeDto>(`${this.apiUrl}/createIncome`, income, { headers: this.headers } );
  }

  deleteIncome(incomeId: string): Observable<void> {
    const params = new HttpParams().set('incomeId', incomeId);
    return this.http.delete<void>(`${this.apiUrl}/delete`, { params, headers: this.headers });
  }
}
