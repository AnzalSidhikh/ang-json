import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://dummyjson.com/users';
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.apiUrl).pipe(
      map(response => ({
        users: response.users.map(user => ({
          ...user,
          status: user.status || 'active'
        }))
      })),
      tap(response => {
        this.users = response.users;
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(user => ({
        ...user,
        status: user.status || 'active'
      }))
    );
  }

  createUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: Math.floor(Math.random() * 1000) + 100
    };

    // Add the new user to our local array
    this.users.push(newUser);

    // Simulate API call
    return this.http.post<User>(this.apiUrl + '/add', user).pipe(
      map(() => newUser)
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    const updatedUser = { ...user, id };
    
    // Update user in local array
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }

    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      map(() => updatedUser)
    );
  }

  deleteUser(id: number): Observable<any> {
    // Remove from local array
    this.users = this.users.filter(user => user.id !== id);

    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCurrentUsers(): User[] {
    return this.users;
  }
}