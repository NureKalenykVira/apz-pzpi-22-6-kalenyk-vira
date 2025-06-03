import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Refrigerator {
  RefrigeratorID: number;
  UserID: number;
  Name: string;
  Location: string;
  CreatedAt: string;
  UpdatedAt: string;
}

@Component({
  selector: 'app-fridges',
  imports: [CommonModule, FormsModule],
  templateUrl: './fridges.component.html',
  styleUrls: ['./fridges.component.scss']
})
export class FridgesComponent implements OnInit {
  refrigerators: Refrigerator[] = [];
  fridgeToDelete: Refrigerator | null = null;
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
    this.fetchRefrigerators();
  }

  fetchRefrigerators(): void {
    this.http.get<Refrigerator[]>(`${this.apiUrl}/refrigerators`, { headers: this.authHeaders })
      .subscribe({
        next: data => this.refrigerators = data,
        error: err => console.error('Помилка отримання холодильників:', err)
      });
  }

  saveFridge(fridge: Refrigerator): void {
    const body = {
      userId: fridge.UserID,
      name: fridge.Name,
      location: fridge.Location
    };

    this.http.put(`${this.apiUrl}/refrigerators/${fridge.RefrigeratorID}`, body, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Дані холодильника "${fridge.Name}" оновлено`;
          setTimeout(() => this.message = '', 3000);
        },
        error: err => {
          console.error('Помилка оновлення:', err);
          this.message = 'Помилка при оновленні';
        }
      });
  }

  confirmDelete(fridge: Refrigerator): void {
    this.fridgeToDelete = fridge;
    this.confirmDeleteModal = true;
  }

  cancelDelete(): void {
    this.fridgeToDelete = null;
    this.confirmDeleteModal = false;
  }

  deleteFridge(): void {
    if (!this.fridgeToDelete) return;

    this.http.delete(`${this.apiUrl}/refrigerators/${this.fridgeToDelete.RefrigeratorID}`, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Холодильник "${this.fridgeToDelete?.Name}" видалено`;
          this.refrigerators = this.refrigerators.filter(f => f.RefrigeratorID !== this.fridgeToDelete?.RefrigeratorID);
          this.cancelDelete();
        },
        error: err => {
          console.error('Помилка видалення:', err);
          this.message = 'Помилка при видаленні холодильника';
        }
      });
  }
}
