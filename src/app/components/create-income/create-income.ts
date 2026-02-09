import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { IncomeService } from '../../services/income.service';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';

@Component({
  selector: 'app-create-income',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-income.html',
  styleUrls: ['./create-income.css'],
})
export class CreateIncome implements OnInit {

  incomeForm : FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  categories: CategoryDto[] = [];
  loadingCategories = false;

  constructor(
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.loadingCategories = false;
      }
    });
  }

  onSubmit() {
    if (this.incomeForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.incomeService.createIncome(this.incomeForm.value).subscribe({
      next: () => {
        this.successMessage = 'Ingreso creado correctamente';
        this.incomeForm.reset();
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el ingreso';
        this.loading = false;
      }
    });
  }

}