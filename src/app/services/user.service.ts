import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordParamsDto, UsersDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<UsersDto[]> {
    return this.http.get<UsersDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete?id=${id}`, {
      headers: this.getHeaders()
    });
  }

  changePassword(userId: string, changePasswordData: ChangePasswordParamsDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/changePassword?id=${userId}`, changePasswordData, { headers: this.getHeaders() });
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
