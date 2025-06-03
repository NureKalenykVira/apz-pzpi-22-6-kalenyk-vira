import { Component, OnInit } from '@angular/core';
import { RefrigeratorService } from '../../core/refrigerator.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { computeAnalytics } from '../../core/utils/analytics.utils';
import { EMPTY } from 'rxjs';
import { forkJoin, map, switchMap } from 'rxjs';
import { SensorService } from '../../core/sensor.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { TranslatePipe } from '../../core/translate.pipe';

interface Refrigerator {
  id?: number;
  name: string;
  location: string;
  latestTemp?: string;
  latestHumidity?: string;
}

export interface SensorDataPoint {
  Temperature: number;
  Humidity: number;
  Timestamp: string;
}

declare var Chart: any;

@Component({
  selector: 'app-refrigerators',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe ],
  templateUrl: './refrigerators.component.html',
  styleUrl: './refrigerators.component.scss'
})
export class RefrigeratorsComponent implements OnInit {
  showModal = false;
  newFridge: Refrigerator = { name: '', location: '' };
  refrigerators: Refrigerator[] = [];
  editingFridge: Refrigerator | null = null;
  editName = '';
  editLocation = '';
  showAnalyticsModal = false;
  selectedFridge: Refrigerator | null = null;
  sensorData: any[] = [];
  analyticsData: any = {};
  productForm!: FormGroup;
  showEmptyFridgeHint = false;
  tempChart: any = null;
  humidityChart: any = null;
  lang: 'ua' | 'en' = localStorage.getItem('lang') as 'ua' | 'en' || 'ua';

  constructor(private refrigeratorService: RefrigeratorService, private authService: AuthService, private sensorService: SensorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.refrigeratorService.getRefrigerators().subscribe({
      next: (response) => {
      if (Array.isArray(response)) {
        this.refrigerators = response;
        this.showEmptyFridgeHint = response.length === 0;
      } else {
        this.refrigerators = [];
        this.showEmptyFridgeHint = true;
      }
    },
    error: (err) => {
      console.error('Error loading refrigerators:', err);
      this.refrigerators = [];
      this.showEmptyFridgeHint = true;
    }
  });
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      expirationDate: ['', Validators.required],
      rfidTag: ['', [Validators.required, Validators.pattern(/^RFID\d{4,}$/)]]
    });
  }

  setLang(lang: 'ua' | 'en') {
    localStorage.setItem('lang', lang);
    window.location.reload(); // Найпростіший спосіб для повної заміни текстів
  }

  addRefrigerator(): void {
    const name = this.newFridge.name.trim();
    const location = this.newFridge.location.trim();
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('User ID not found in token.');
      return;
    }

    if (!name || !userId || (this.newFridge.location && !location)) {
      return;
    }

    this.refrigeratorService.createRefrigerator({
      userId,
      name,
      location: location || ''
    }).subscribe(() => {
      this.resetForm();
      this.refreshRefrigerators();
    });
  }

  closeModal(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showModal = false;
    this.newFridge = { name: '', location: '' };
  }

  private refreshRefrigerators(): void {
    this.refrigeratorService.getRefrigerators().subscribe(fridges => {
      this.refrigerators = fridges;
    });
  }

  startEdit(fridge: Refrigerator): void {
    this.editingFridge = { ...fridge };
    this.editName = fridge.name;
    this.editLocation = fridge.location;
    this.showModal = true;
  }

  updateRefrigerator(): void {
    if (!this.editingFridge || !this.editingFridge.id) return;

    const userId = this.authService.getUserId();
    if (userId === null) {
      console.error('User ID not found');
      return;
    }
    this.refrigeratorService.updateRefrigerator(
      this.editingFridge.id,
      {
        userId,
        name: this.editName.trim(),
        location: this.editLocation.trim()
      }
    ).subscribe(() => {
      this.resetForm();
      this.refreshRefrigerators();
    });
  }

  deleteRefrigerator(fridge: Refrigerator): void {
    if (confirm(`Delete refrigerator "${fridge.name}"?`)) {
      this.refrigeratorService.deleteRefrigerator(fridge.id!).subscribe(() => {
        this.refreshRefrigerators();
      });
    }
  }

  selectedFridgeForDelete: Refrigerator | null = null;
  showDeleteConfirm = false;

  askDelete(fridge: Refrigerator): void {
    this.selectedFridgeForDelete = fridge;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (!this.selectedFridgeForDelete?.id) return;

    this.refrigeratorService.deleteRefrigerator(this.selectedFridgeForDelete.id).subscribe(() => {
      this.refreshRefrigerators();
      this.closeDeleteModal();
    });
  }

  closeDeleteModal(): void {
    this.showDeleteConfirm = false;
    this.selectedFridgeForDelete = null;
  }

  logout(): void {
    this.authService.logout();
  }

  analyticsRefreshInterval: any = null;

  openFridgeAnalytics(fridge: Refrigerator): void {
    this.selectedFridge = fridge;
    this.showAnalyticsModal = true;

    this.sensorService.getSensorsByRefrigerator(fridge.id!).pipe(
      switchMap((sensors: any[]) => {
        const sensorIds = sensors
          .map(s => s.SensorID)
          .filter((id): id is number => typeof id === 'number');

        if (sensorIds.length === 0) {
          alert('Sensors found, but no valid IDs.');
          this.showAnalyticsModal = false;
          return EMPTY;
        }

        return forkJoin(sensorIds.map(id =>
          this.sensorService.getSensorData(id).pipe(
            map(data => {
              if (!Array.isArray(data)) {
                console.warn(`Sensor ${id} returned no data`, data);
                return [];
              }
            return data;
            })
          )));
      }),
      map((dataArrays: any[][]) => dataArrays.flat())
    ).subscribe({
      next: (data: any[]) => {
        this.sensorData = data;
        this.prepareAnalytics(data);
      },
    error: (err) => {
      console.error('Analytics error:', err);
      }
    });
  }

  closeAnalytics(): void {
    this.selectedFridge = null;
    this.showAnalyticsModal = false;
  }

  tempChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        tension: 0.3
      }
    ]
  };

  humidityChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
        tension: 0.3
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } }
    }
  };

  prepareAnalytics(rawData: any[]): void {
   const grouped: { [timestamp: string]: Partial<SensorDataPoint> } = {};
    for (const entry of rawData) {
      const ts = entry.Timestamp;
        if (!grouped[ts]) grouped[ts] = { Timestamp: ts };
        if (entry.Temperature !== null && entry.Temperature !== undefined) grouped[ts].Temperature = entry.Temperature;
        if (entry.Humidity !== null && entry.Humidity !== undefined) grouped[ts].Humidity = entry.Humidity;
    }

    const dataPoints: SensorDataPoint[] = Object.values(grouped)
      .filter(point => point.Temperature != null && point.Humidity != null) as SensorDataPoint[];
    console.log('dataPoints:', dataPoints);
    const sorted = dataPoints.sort((a, b) =>
      new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
    );
    this.analyticsData = computeAnalytics(sorted);
    console.log('analyticsData:', this.analyticsData);
    const labels = sorted.map(d => {
      const date = new Date(d.Timestamp);
      return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }) +
           ', ' +
           date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      });
    const temps = sorted.map(d => d.Temperature);
    const hums = sorted.map(d => d.Humidity);

    this.analyticsData = computeAnalytics(sorted);

    setTimeout(() => {
      if (this.tempChart) this.tempChart.destroy();
      if (this.humidityChart) this.humidityChart.destroy();

      const tempCtx = document.getElementById('temperatureChart') as HTMLCanvasElement;
      if (tempCtx) {
        this.tempChart = new Chart(tempCtx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Temp (°C)',
              data: temps,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.3
            }]
          }
        });
      }
      const humidityCtx = document.getElementById('humidityChart') as HTMLCanvasElement;
      if (humidityCtx) {
        this.humidityChart = new Chart(humidityCtx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Humidity (%)',
              data: hums,
              borderColor: 'rgba(255,99,132,1)',
              tension: 0.3
            }]
          }
        });
      }
    }, 0);
  }

  showProductsModal = false;
  products: any[] = [];
  showAddProductForm = false;
  editingProduct: any = null;

  openFridgeProducts(fridge: Refrigerator): void {
    this.selectedFridge = fridge;
    this.showProductsModal = true;
    this.loadProducts(fridge.id!);
  }

  loadProducts(fridgeId: number): void {
    this.refrigeratorService.getProductsByRefrigerator(fridgeId).subscribe({
      next: (products) => {
        console.log('Products received:', products);
        this.products = products;
        this.checkExpiringProducts(products);
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  startEditProduct(product: any): void {
    this.editingProduct = product;
    this.productForm = { ...product };
    this.showAddProductForm = true;
  }

  deleteProduct(product: any): void {
    if (confirm(`Delete product "${product.name}"?`)) {
      this.refrigeratorService.deleteProduct(product.productId).subscribe(() => {
        this.loadProducts(this.selectedFridge!.id!);
      });
    }
  }

  submitProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // щоб показати помилки
      return;
    }

    const payload = {
      ...this.productForm.value,
      refrigeratorId: this.selectedFridge!.id
    };

    if (this.editingProduct) {
      this.refrigeratorService.updateProduct(this.editingProduct.ProductID, payload).subscribe(() => {
        this.loadProducts(this.selectedFridge!.id!);
        this.cancelProductForm();
      });
    } else {
      this.refrigeratorService.addProduct(payload).subscribe(() => {
        this.loadProducts(this.selectedFridge!.id!);
        this.cancelProductForm();
      });
    }
  }

  cancelProductForm(): void {
    this.productForm.reset();
    this.editingProduct = null;
    this.showAddProductForm = false;
  }

  closeProductsModal(): void {
    this.showProductsModal = false;
    this.cancelProductForm();
  }

  productToDelete: any = null;
  showDeleteConfirmModal = false;

  // Для модального вікна підтвердження видалення продукту
showDeleteProductConfirmModal = false;

askDeleteProduct(product: any): void {
  this.productToDelete = product;
  this.showDeleteProductConfirmModal = true;
}

confirmDeleteProduct(): void {
  if (!this.productToDelete) return;
  this.refrigeratorService.deleteProduct(this.productToDelete.ProductID).subscribe(() => {
    this.loadProducts(this.selectedFridge!.id!);
    this.cancelDeleteProduct();
  });
}

cancelDeleteProduct(): void {
  this.productToDelete = null;
  this.showDeleteProductConfirmModal = false;
}

expirationAlerts: string[] = [];

  checkExpiringProducts(products: any[]): void {
    const today = new Date();
    const alerts: string[] = [];

    products.forEach(product => {
      const expiration = new Date(product.ExpirationDate);
      const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        alerts.push(`❌ ${product.Name} вже протерміновано!`);
      } else if (diffDays === 0) {
        alerts.push(`⚠️ ${product.Name} спливає сьогодні.`);
      } else if (diffDays === 1) {
        alerts.push(`⚠️ ${product.Name} спливає завтра.`);
      }  else if (diffDays === 3) {
        alerts.push(`ℹ️ ${product.Name} спливає через 3 дні.`);
      }
    });

    this.expirationAlerts = alerts;
  }

}
