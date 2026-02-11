import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedUsersDto, UsersDto, LoginParamsDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  signup(userData: UsersDto): Observable<AuthenticatedUsersDto> {
    return this.http.post<AuthenticatedUsersDto>(`${this.apiUrl}/signup`, userData)
      .pipe(
        tap(response => {
          this.saveToken(response.serviceToken);
          this.saveUser(response.userDto);
        })
      );
  }

  login(loginData: LoginParamsDto): Observable<AuthenticatedUsersDto> {
    return this.http.post<AuthenticatedUsersDto>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.saveToken(response.serviceToken);
          this.saveUser(response.userDto);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.roleType === 'ADMIN';
  }
}
