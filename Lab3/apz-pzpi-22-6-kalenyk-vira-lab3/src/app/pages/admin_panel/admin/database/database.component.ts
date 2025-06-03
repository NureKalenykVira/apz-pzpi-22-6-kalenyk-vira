import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DbProcess {
  Id: number;
  User: string;
  Host: string;
  db: string | null;
  Command: string;
  Time: number;
  State: string;
  Info: string | null;
}

@Component({
  selector: 'app-database',
  imports: [CommonModule, FormsModule],
  templateUrl: './database.component.html',
  styleUrl: './database.component.scss'
})
export class DatabaseComponent {
  apiUrl = 'http://localhost:3000';
  processes: DbProcess[] = [];
  message = '';
  isBackupLoading = false;
  isRestoreLoading = false;

  constructor(private http: HttpClient) {}

  get authHeaders() {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(): void {
    this.http.get<DbProcess[]>(`${this.apiUrl}/admin/db/performance`, { headers: this.authHeaders })
      .subscribe({
        next: data => { this.processes = data; },
        error: () => { this.message = 'Не вдалося отримати процеси бази даних.'; }
      });
  }

  backup(): void {
    this.isBackupLoading = true;
    this.http.post(`${this.apiUrl}/admin/db/backup`, {}, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = 'Бекап бази даних створено!';
          this.isBackupLoading = false;
        },
        error: () => {
          this.message = 'Не вдалося створити бекап!';
          this.isBackupLoading = false;
        }
      });
  }

  restore(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.isRestoreLoading = true;

    const formData = new FormData();
    formData.append('backup', file);

    this.http.post(`${this.apiUrl}/admin/db/restore`, formData, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = 'Базу даних успішно відновлено!';
          this.isRestoreLoading = false;
        },
        error: () => {
          this.message = 'Не вдалося відновити базу даних.';
          this.isRestoreLoading = false;
        }
      });
  }
}
