import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-category.html',
  styleUrls: ['./create-category.css'],
})
export class CreateCategory {
  categoryForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.categoryService.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.successMessage = 'Categoría creada correctamente';
        this.categoryForm.reset();
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/categories']);
        }, 15);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear la categoría';
        this.loading = false;
      }
    });
  }
}
