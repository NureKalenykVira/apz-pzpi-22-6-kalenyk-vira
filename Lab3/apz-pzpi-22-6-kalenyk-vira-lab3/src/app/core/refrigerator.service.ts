import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefrigeratorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRefrigerators(): Observable<any[]> {
    const userId = localStorage.getItem('user_id');

    return this.http.get<any[]>(`${this.apiUrl}/refrigerators/user/${userId}`).pipe(
      map(refrigerators =>
        refrigerators.map(fridge => ({
          id: fridge.RefrigeratorID,
          name: fridge.Name || 'No name',
          location: fridge.Location || 'Unknown',
          latestTemp: (Math.random() * 6 + 2).toFixed(1),
          latestHumidity: (Math.random() * 40 + 30).toFixed(0)
        }))
      )
    );
  }

  createRefrigerator(data: { userId: number; name: string; location: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/refrigerators`, data);
  }

  updateRefrigerator(id: number, data: { userId: number, name: string, location: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/refrigerators/${id}`, data);
  }

  deleteRefrigerator(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/refrigerators/${id}`);
  }

  getProductsByRefrigerator(fridgeId: number) {
    console.log('Запит продуктів для холодильника', fridgeId);
    return this.http.get<any[]>(`${this.apiUrl}/products/refrigerator/${fridgeId}`);
  }

addProduct(product: any) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.post(`${this.apiUrl}/products`, product, { headers });
}

updateProduct(productId: number, product: any) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.put(`${this.apiUrl}/products/${productId}`, product, { headers });
}

deleteProduct(productId: number) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.delete(`${this.apiUrl}/products/${productId}`, { headers });
}
}
