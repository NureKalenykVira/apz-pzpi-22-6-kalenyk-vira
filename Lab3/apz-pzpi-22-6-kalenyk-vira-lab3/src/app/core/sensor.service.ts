import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSensorsByRefrigerator(fridgeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sensors/refrigerator/${fridgeId}`);
  }

  getSensorData(sensorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sensor-data/sensor/${sensorId}`);
  }
}
