
import { Component } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-expense.html',
  styleUrls: ['./create-expense.css'],
})
export class CreateExpense {
  expenseForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required]
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
