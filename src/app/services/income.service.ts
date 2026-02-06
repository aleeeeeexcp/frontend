import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeDto } from '../models/income.model';


@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = '/api/incomes';

  constructor(private http: HttpClient) {}

  getAllUsersIncomes(): Observable<IncomeDto[]> {
    return this.http.get<IncomeDto[]>(this.apiUrl);
  }

  createIncome(income: IncomeDto): Observable<IncomeDto> {
    return this.http.post<IncomeDto>(`${this.apiUrl}/createIncome`, income);
  }

  deleteIncome(incomeId: string): Observable<void> {
    const params = new HttpParams().set('incomeId', incomeId);
    return this.http.delete<void>(`${this.apiUrl}/delete`, { params });
  }
}
