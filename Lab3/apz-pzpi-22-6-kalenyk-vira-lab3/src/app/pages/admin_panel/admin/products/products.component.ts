import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  ProductID: number;
  RefrigeratorID: number;
  Name: string;
  Category: string;
  ExpirationDate: string;
  RFIDTag: string;
  AddedAt: string;
  UpdatedAt: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productToDelete: Product | null = null;
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
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/products`, { headers: this.authHeaders })
      .subscribe({
        next: data => {
          this.products = data.map(p => ({
            ...p,
            ExpirationDate: p.ExpirationDate ? p.ExpirationDate.substring(0, 10) : ''
          }));
        },
        error: err => {
          this.message = 'Не вдалося отримати продукти';
          this.products = [];
          console.error('Помилка отримання продуктів:', err);
        }
      });
  }

  saveProduct(product: Product): void {
    const body = {
      name: product.Name,
      category: product.Category,
      expirationDate: product.ExpirationDate,
      rfidTag: product.RFIDTag
    };

    this.http.put(`${this.apiUrl}/products/${product.ProductID}`, body, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Дані продукту "${product.Name}" оновлено`;
          setTimeout(() => this.message = '', 3000);
        },
        error: err => {
          console.error('Помилка оновлення продукту:', err);
          this.message = 'Помилка при оновленні продукту';
        }
      });
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.confirmDeleteModal = true;
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.confirmDeleteModal = false;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;

    this.http.delete(`${this.apiUrl}/products/${this.productToDelete.ProductID}`, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.message = `Продукт "${this.productToDelete?.Name}" видалено`;
          this.products = this.products.filter(p => p.ProductID !== this.productToDelete?.ProductID);
          this.cancelDelete();
        },
        error: err => {
          console.error('Помилка видалення продукту:', err);
          this.message = 'Помилка при видаленні продукту';
        }
      });
  }
}
