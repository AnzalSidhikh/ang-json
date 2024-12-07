import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">{{isEditMode ? 'Edit' : 'Add'}} User</h2>
      
      <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="max-w-md">
        <div class="mb-4">
          <label class="block mb-2">Username:</label>
          <input 
            type="text" 
            [(ngModel)]="user.username" 
            name="username" 
            required 
            class="w-full border p-2 rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2">Age:</label>
          <input 
            type="number" 
            [(ngModel)]="user.age" 
            name="age" 
            required 
            class="w-full border p-2 rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2">Email:</label>
          <input 
            type="email" 
            [(ngModel)]="user.email" 
            name="email" 
            required 
            class="w-full border p-2 rounded"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2">Status:</label>
          <select 
            [(ngModel)]="user.status" 
            name="status" 
            required 
            class="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="flex gap-4">
          <button 
            type="submit" 
            [disabled]="!userForm.form.valid"
            class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{isEditMode ? 'Update' : 'Create'}} User
          </button>

          <button 
            type="button"
            (click)="cancel()"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  user: User = {
    username: '',
    age: 0,
    status: 'active',
    email: ''
  };
  isEditMode = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.isEditMode = true;
      this.userService.getUserById(userId).subscribe({
        next: (user) => this.user = user,
        error: (error) => console.error('Error loading user:', error)
      });
    }
  }

  onSubmit() {
    const action = this.isEditMode
      ? this.userService.updateUser(this.user.id!, this.user)
      : this.userService.createUser(this.user);

    action.subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 100);
      },
      error: (error) => console.error('Error saving user:', error)
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}