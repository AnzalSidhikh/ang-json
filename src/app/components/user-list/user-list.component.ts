import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">User List</h2>
      
      <div class="mb-4">
        <label class="mr-2">Filter by Status:</label>
        <select [(ngModel)]="selectedStatus" (change)="filterUsers()" class="border p-2 rounded">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button [routerLink]="['/users/new']" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add New User
      </button>

      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="border p-2">Username</th>
            <th class="border p-2">Age</th>
            <th class="border p-2">Email</th>
            <th class="border p-2">Status</th>
            <th class="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td class="border p-2">{{user.username}}</td>
            <td class="border p-2">{{user.age}}</td>
            <td class="border p-2">{{user.email}}</td>
            <td class="border p-2">
              <span 
                [class]="user.status === 'active' ? 'text-green-600' : 'text-red-600'"
                class="font-medium"
              >
                {{user.status}}
              </span>
            </td>
            <td class="border p-2">
              <button 
                [routerLink]="['/users/edit', user.id]" 
                class="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                *ngIf="user.id"
              >
                Edit
              </button>
              <button 
                (click)="deleteUser(user)"
                class="bg-red-500 text-white px-2 py-1 rounded"
                *ngIf="user.id"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedStatus: string = 'all';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // First, check if we have users in the service
    const currentUsers = this.userService.getCurrentUsers();
    if (currentUsers.length > 0) {
      this.users = currentUsers;
      this.filterUsers();
    } else {
      // If no users in service, fetch from API
      this.userService.getUsers().subscribe({
        next: (response) => {
          this.users = response.users;
          this.filterUsers();
        },
        error: (error) => console.error('Error loading users:', error)
      });
    }
  }

  filterUsers() {
    if (this.selectedStatus === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => user.status === this.selectedStatus);
    }
  }

  deleteUser(user: User) {
    if (!user.id) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }
}