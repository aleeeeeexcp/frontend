import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
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
  users = signal<UsersDto[]>([]);
  selectedUserIds = signal<string[]>([]);
  loadingUsers = signal(true);
  successMessage = signal('');
  errorMessage = signal('');
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
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
    this.loadingUsers.set(true);
    const currentUser = this.authService.getUser();
    const currentUserId = currentUser?.id;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const filteredUsers = currentUserId 
          ? users.filter(user => user.id !== currentUserId)
          : users;
        this.users.set(filteredUsers || []);
        this.loadingUsers.set(false);
      },
      error: (err) => {
        console.error('✗ Error al cargar usuarios:', err);
        this.users.set([]);
        this.loadingUsers.set(false);
      }
    });
  }

  toggleUserSelection(userId: string) {
    const currentIds = this.selectedUserIds();
    const index = currentIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.set(currentIds.filter(id => id !== userId));
    } else {
      this.selectedUserIds.set([...currentIds, userId]);
    }
    this.groupForm.patchValue({ memberIds: this.selectedUserIds() });
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUserIds().includes(userId);
  }

  onSubmit() {
    if (this.groupForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const groupData: GroupDto = {
        name: this.groupForm.value.name!,
        description: this.groupForm.value.description!,
        memberIds: this.groupForm.value.memberIds || []
      };

      this.groupService.createGroup(groupData).subscribe({
        next: (response) => {
          console.log('✓ Grupo creado exitosamente:', response);
          this.successMessage.set('Grupo creado exitosamente');
          this.isSubmitting.set(false);
          this.groupForm.reset();

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 15);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Error al crear el grupo. Intenta nuevamente.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
