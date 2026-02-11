import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedUsersDto, UsersDto, LoginParamsDto, ChangePasswordParamsDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
  private currentUserSignal = signal<any>(null);

  constructor(private http: HttpClient) {
    // Inicializar el signal con el usuario de localStorage si existe
    const storedUser = this.getUserFromStorage();
    if (storedUser) {
      this.currentUserSignal.set(storedUser);
    }
  }

  signup(userData: UsersDto): Observable<AuthenticatedUsersDto> {
    return this.http.post<AuthenticatedUsersDto>(`${this.apiUrl}/signup`, userData)
      .pipe(
        tap(response => {
          this.saveToken(response.serviceToken);
          this.saveUser(response.userDto);
          this.currentUserSignal.set(response.userDto);
        })
      );
  }

  login(loginData: LoginParamsDto): Observable<AuthenticatedUsersDto> {
    return this.http.post<AuthenticatedUsersDto>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.saveToken(response.serviceToken);
          this.saveUser(response.userDto);
          this.currentUserSignal.set(response.userDto);
        })
      );
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
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

  private getUserFromStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUser(): any {
    return this.getUserFromStorage();
  }

  // Retorna el signal readonly para que los componentes puedan suscribirse
  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.roleType === 'ADMIN';
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  changePassword(userId: string, data: ChangePasswordParamsDto): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/changePassword?id=${userId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateProfile(userId: string, userData: UsersDto): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/updateProfile?id=${userId}`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Actualizar el usuario en localStorage y el signal
        const currentUser = this.getUser();
        if (currentUser) {
          currentUser.username = userData.username;
          currentUser.email = userData.email;
          this.saveUser(currentUser);
          this.currentUserSignal.set(currentUser);
        }
      })
    );
  }

  updateUser(user: any): void {
    this.saveUser(user);
  }
}
