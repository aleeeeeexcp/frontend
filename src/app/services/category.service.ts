import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.apiUrl}/createCategory`, category, { headers: this.getHeaders() });
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCategory`, {
      headers: this.getHeaders(),
      body: id
    });
  }

  updateCategory(category: CategoryDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/updateCategory`, category, { headers: this.getHeaders() });
  }
}
