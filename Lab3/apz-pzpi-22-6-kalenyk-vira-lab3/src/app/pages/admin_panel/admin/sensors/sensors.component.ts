import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sensor {
  SensorID: number;
  RefrigeratorID: number;
  Type: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

@Component({
  selector: 'app-sensors',
  imports: [CommonModule, FormsModule],
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit {
  sensors: Sensor[] = [];
  sensorToDelete: Sensor | null = null;
  confirmDeleteModal = false;
  message = '';
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });
  }

  ngOnInit(): void {
    this.fetchSensors();
  }

  fetchSensors(): void {
    this.http.get<Sensor[]>(`${this.apiUrl}/sensors`, { headers: this.authHeaders })
      .subscribe({
        next: data => this.sensors = data,
        error: err => {
          this.message = 'Не вдалося отримати сенсори';
          this.sensors = [];
          console.error('Помилка отримання сенсорів:', err);
        }
      });
  }

  saveSensor(sensor: Sensor): void {
    const body = {
      type: sensor.Type,
      status: sensor.Status
    };

    this.http.put(`${this.apiUrl}/sensors/${sensor.SensorID}`, body, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Сенсор "${sensor.SensorID}" оновлено`;
          setTimeout(() => this.message = '', 3000);
        },
        error: err => {
          console.error('Помилка оновлення сенсора:', err);
          this.message = 'Помилка при оновленні сенсора';
        }
      });
  }

  confirmDelete(sensor: Sensor): void {
    this.sensorToDelete = sensor;
    this.confirmDeleteModal = true;
  }

  cancelDelete(): void {
    this.sensorToDelete = null;
    this.confirmDeleteModal = false;
  }

  deleteSensor(): void {
    if (!this.sensorToDelete) return;

    this.http.delete(`${this.apiUrl}/sensors/${this.sensorToDelete.SensorID}`, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Сенсор ${this.sensorToDelete?.SensorID} видалено`;
          this.sensors = this.sensors.filter(s => s.SensorID !== this.sensorToDelete?.SensorID);
          this.cancelDelete();
        },
        error: err => {
          console.error('Помилка видалення сенсора:', err);
          this.message = 'Помилка при видаленні сенсора';
        }
      });
  }
}
