import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { GroupDto } from '../../models/group.model';
import { UsersDto } from '../../models/user.model';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-group.html',
  styleUrls: ['./create-group.css']
})
export class CreateGroup implements OnInit {
  groupForm: FormGroup;
  users: UsersDto[] = [];
  selectedUserIds: string[] = [];
  loadingUsers = true;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      memberIds: [[]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('✗ Error al cargar usuarios:', err);
        this.users = [];
        this.loadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleUserSelection(userId: string) {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
    this.groupForm.patchValue({ memberIds: this.selectedUserIds });
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUserIds.includes(userId);
  }

  onSubmit() {
    if (this.groupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const groupData: GroupDto = {
        name: this.groupForm.value.name!,
        description: this.groupForm.value.description!,
        memberIds: this.groupForm.value.memberIds || []
      };

      this.groupService.createGroup(groupData).subscribe({
        next: (response) => {
          console.log('✓ Grupo creado exitosamente:', response);
          this.successMessage = 'Grupo creado exitosamente';
          this.isSubmitting = false;
          this.groupForm.reset();
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al crear el grupo. Intenta nuevamente.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
