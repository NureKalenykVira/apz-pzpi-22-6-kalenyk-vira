import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AdminLog {
  id: number;
  admin_id: number;
  action: string;
  description: string;
  created_at: string;
}

@Component({
  selector: 'app-monitoring',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.scss'
})
export class MonitoringComponent {
  apiUrl = 'http://localhost:3000';
  logs: AdminLog[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  get authHeaders() {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.http.get<AdminLog[]>(`${this.apiUrl}/admin/logs`, { headers: this.authHeaders })
      .subscribe({
        next: data => { this.logs = data; },
        error: err => { this.message = 'Не вдалося отримати логи адміністратора.'; }
      });
  }
}
