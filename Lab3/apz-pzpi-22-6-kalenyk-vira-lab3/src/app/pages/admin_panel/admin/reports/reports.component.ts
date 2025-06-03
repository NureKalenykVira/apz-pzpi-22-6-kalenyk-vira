import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GeneralReport {
  totalFridges: number;
  totalProducts: number;
  totalSensors: number;
  generatedAt: string;
}

interface ApiStatus {
  name: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
   apiUrl = 'http://localhost:3000';
  report: GeneralReport | null = null;
  apiStatus: ApiStatus[] = [];
  message = '';
  interval: any;

  constructor(private http: HttpClient) {}

  get authHeaders() {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  ngOnInit(): void {
    this.fetchAll();
    this.interval = setInterval(() => this.fetchAll(), 180_000); // оновлення раз на 3 хвилини
  }

  fetchAll(): void {
    this.fetchReport();
    this.fetchApiStatus();
  }

  fetchReport(): void {
    this.http.get<GeneralReport>(`${this.apiUrl}/admin/general-report`, { headers: this.authHeaders })
      .subscribe({
        next: data => { this.report = data; },
        error: err => { this.message = 'Не вдалося отримати аналітику.'; }
      });
  }

  fetchApiStatus(): void {
    this.http.get<ApiStatus[]>(`${this.apiUrl}/admin/api-status`, { headers: this.authHeaders })
      .subscribe({
        next: data => { this.apiStatus = data; },
        error: err => { this.message = 'Не вдалося отримати статуси API.'; }
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
