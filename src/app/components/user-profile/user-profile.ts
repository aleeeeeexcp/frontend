import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  get user() {
    return this.authService.currentUser;
  }

  ngOnInit() {
    const userData = this.authService.getUser();
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
    this.initForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: [this.user()?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [this.user()?.email || '', [Validators.required, Validators.email]]
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.profileForm.patchValue({
      username: this.user()?.username,
      email: this.user()?.email
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedData = this.profileForm.value;
    const userId = this.user()?.id;

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.authService.updateProfile(userId, updatedData).subscribe({
      next: () => {
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleBadgeClass(): string {
    return this.user()?.roleType === 'ADMIN' ? 'badge-admin' : 'badge-user';
  }

  getRoleDisplayName(): string {
    return this.user()?.roleType === 'ADMIN' ? 'Administrador' : 'Usuario';
  }
}
