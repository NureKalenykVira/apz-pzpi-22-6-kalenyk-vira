import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface User {
  UserID: number;
  Name: string;
  Email: string;
  Role: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private apiUrl = 'http://localhost:3000';
  users: User[] = [];
  roles: string[] = ['User', 'GlobalAdmin', 'BusinessLogicAdmin', 'ServiceAdmin', 'InfrastructureAdmin'];

  userToDelete: User | null = null;
  confirmDeleteModal = false;
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });
  }

  fetchUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.authHeaders })
      .subscribe({
        next: data => this.users = data,
        error: err => console.error('Помилка отримання користувачів:', err)
      });
  }

  changeRole(user: User): void {
    const body = {
      name: user.Name,
      email: user.Email,
      password: '',
      role: user.Role
    };

    this.http.put(`${this.apiUrl}/users/${user.UserID}`, body, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Роль для ${user.Name} змінено`;
          setTimeout(() => this.message = '', 3000);
        },
        error: err => {
          console.error('Помилка зміни ролі:', err);
          this.message = 'Помилка зміни ролі';
        }
      });
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.confirmDeleteModal = true;
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.confirmDeleteModal = false;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.http.delete(`${this.apiUrl}/users/${this.userToDelete.UserID}`, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Користувача ${this.userToDelete?.Name} видалено`;
          this.users = this.users.filter(u => u.UserID !== this.userToDelete?.UserID);
          this.cancelDelete();
        },
        error: err => {
          console.error('Помилка видалення:', err);
          this.message = 'Помилка при видаленні користувача';
        }
      });
  }
}
