import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-create-income',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-income.html',
  styleUrls: ['./create-income.css'],
})
export class CreateIncome {

  incomeForm : FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private incomeService: IncomeService  , private fb: FormBuilder) {
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required]
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
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el ingreso';
        this.loading = false;
      }
    });
  }

}