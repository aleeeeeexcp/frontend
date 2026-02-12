
import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CategoryDto } from '../../models/category.model';
import { GroupDto } from '../../models/group.model';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  groups: GroupDto[] = [];
  loadingGroups = false;
  groupId: string | null = null;

  constructor(
    private expenseService: ExpenseService, 
    private categoryService: CategoryService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      categoryId: [''],
      groupId: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadGroups();
    
    // Pre-seleccionar grupo si viene como parámetro
    this.route.queryParams.subscribe(params => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.expenseForm.patchValue({ groupId: this.groupId });
      }
    });
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
    if (this.expenseForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage = 'Gasto creado correctamente';
        this.expenseForm.reset();
        this.loading = false;
        setTimeout(() => {
          if (this.groupId) {
            this.router.navigate(['/groups', this.groupId]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 15);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el gasto';
        this.loading = false;
      }
    });
  }
}
