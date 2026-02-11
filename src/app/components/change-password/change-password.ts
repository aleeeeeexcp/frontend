import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ChangePasswordParamsDto } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
})
export class ChangePassword {
  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const user = this.userService.getUser();
      if (!user || !user.id) {
        this.errorMessage = 'User not found. Please log in again.';
        this.isLoading = false;
        return;
      }

      const changePasswordData: ChangePasswordParamsDto = {
        oldPassword: this.changePasswordForm.value.oldPassword!,
        newPassword: this.changePasswordForm.value.newPassword!
      };

      this.userService.changePassword(user.id, changePasswordData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Password changed successfully!';
          this.changePasswordForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 15);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to change password. Please check your current password.';
          this.isLoading = false;
        }
      });
    }
  }

  get passwordMismatch(): boolean {
    return this.changePasswordForm.hasError('passwordMismatch') && 
           this.changePasswordForm.get('confirmPassword')?.touched || false;
  }
}
