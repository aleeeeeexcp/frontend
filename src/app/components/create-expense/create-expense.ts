
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryDto } from '../../models/category.model';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-expense.html',
  styleUrls: ['./create-expense.css'],
})
export class CreateExpense implements OnInit {
  expenseForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  categories: CategoryDto[] = [];
  loadingCategories = false;

  constructor(
    private expenseService: ExpenseService, 
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
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
    if (this.expenseForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage = 'Gasto creado correctamente';
        this.expenseForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el gasto';
        this.loading = false;
      }
    });
  }
}
