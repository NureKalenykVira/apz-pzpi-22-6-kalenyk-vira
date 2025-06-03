import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sensor { SensorID: number; Type: string; }
interface SensorData {
  SensorDataID: number;
  SensorID: number;
  Temperature?: number | null;
  Humidity?: number | null;
  ProductID?: number | null;
  Timestamp: string;
}

@Component({
  selector: 'app-thresholds',
  imports: [CommonModule, FormsModule],
  templateUrl: './thresholds.component.html',
  styleUrl: './thresholds.component.scss'
})
export class ThresholdsComponent {
  sensors: Sensor[] = [];
  selectedSensorId: number | null = null;
  sensorData: SensorData[] = [];
  apiUrl = 'http://localhost:3000';
  message = '';
  refreshInterval: any = null;

  constructor(private http: HttpClient) {}

  get authHeaders() {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  ngOnInit(): void {
    this.http.get<Sensor[]>(`${this.apiUrl}/sensors`, { headers: this.authHeaders })
      .subscribe({
        next: data => this.sensors = data,
        error: err => { this.message = 'Помилка отримання сенсорів'; }
      });
  }

  onSensorSelect(): void {
    this.loadSensorData();
    this.clearRefresh();
    if (this.selectedSensorId) {
      this.refreshInterval = setInterval(() => this.loadSensorData(), 60000); // 60 000 мс = 1 хвилина
    }
  }

  loadSensorData(): void {
    if (!this.selectedSensorId) { this.sensorData = []; return; }
    this.http.get<SensorData[]>(`${this.apiUrl}/sensor-data/sensor/${this.selectedSensorId}`, { headers: this.authHeaders })
      .subscribe({
        next: data => this.sensorData = data,
        error: err => { this.message = 'Помилка отримання даних'; }
      });
  }

  clearRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearRefresh();
  }
}
