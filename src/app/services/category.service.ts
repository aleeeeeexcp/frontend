import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.apiUrl);
  }

  createCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.apiUrl}/createCategory`, category);
  }
}
