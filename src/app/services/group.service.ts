import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto } from '../models/group.model';
import { ExpenseDto } from '../models/expense.model';
import { IncomeDto } from '../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8080/api/groups';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createGroup(group: GroupDto): Observable<GroupDto> {
    return this.http.post<GroupDto>(
      `${this.apiUrl}/createGroup`,
      group,
      { headers: this.getHeaders() }
    );
  }

  getAllGroups(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(
      this.apiUrl,
      { headers: this.getHeaders() }
    );
  }

  getUserGroups(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(
      `${this.apiUrl}/myGroups`,
      { headers: this.getHeaders() }
    );
  }

  getExpensesByGroup(groupId: string): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(
      `${this.apiUrl}/${groupId}/expenses`,
      { headers: this.getHeaders() }
    );
  }

  getIncomesByGroup(groupId: string): Observable<IncomeDto[]> {
    return this.http.get<IncomeDto[]>(
      `${this.apiUrl}/${groupId}/incomes`,
      { headers: this.getHeaders() }
    );
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${groupId}`,
      { headers: this.getHeaders() }
    );
  }
}
