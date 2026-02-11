import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { IncomeService } from '../../services/income.service';
import { GroupService } from '../../services/group.service';
import { CategoryDto } from '../../models/category.model';
import { GroupDto } from '../../models/group.model';

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
  groups: GroupDto[] = [];
  loadingGroups = false;

  constructor(
    private incomeService: IncomeService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      groupId: ['']
    });
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loadingGroups = true;
    this.groupService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loadingGroups = false;
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
        this.loadingGroups = false;
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
        }, 15);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el ingreso';
        this.loading = false;
      }
    });
  }

}