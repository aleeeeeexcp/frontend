import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-category.html',
  styleUrls: ['./create-category.css'],
})
export class CreateCategory implements OnInit {
  categoryForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  categoryId: string | null = null;

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

  ngOnInit() {
    const state = history.state as { category?: CategoryDto };
    if (state && state.category) {
      this.isEditMode = true;
      this.categoryId = state.category.id;
      this.categoryForm.patchValue({
        name: state.category.name,
        description: state.category.description
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.isEditMode && this.categoryId) {
      const category: CategoryDto = {
        id: this.categoryId,
        ...this.categoryForm.value
      };

      this.categoryService.updateCategory(category).subscribe({
        next: () => {
          this.successMessage = 'Categoría actualizada correctamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 15);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar la categoría';
          this.loading = false;
        }
      });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.successMessage = 'Categoría creada correctamente';
          this.categoryForm.reset();
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 15);
        },
        error: () => {
          this.errorMessage = 'Error al crear la categoría';
          this.loading = false;
        }
      });
    }
  }
}
