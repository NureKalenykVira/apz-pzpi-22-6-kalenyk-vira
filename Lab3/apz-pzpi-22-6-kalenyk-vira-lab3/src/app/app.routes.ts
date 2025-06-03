import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RefrigeratorsComponent } from './pages/refrigerators/refrigerators.component';
import { RefrigeratorDetailsComponent } from './pages/refrigerator-details/refrigerator-details.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import { AdminComponent } from './pages/admin_panel/admin/admin.component';
import { UsersComponent } from './pages/admin_panel/admin/users/users.component';
import { FridgesComponent } from './pages/admin_panel/admin/fridges/fridges.component';
import { ProductsComponent } from './pages/admin_panel/admin/products/products.component';
import { SensorsComponent } from './pages/admin_panel/admin/sensors/sensors.component';
import { ThresholdsComponent } from './pages/admin_panel/admin/thresholds/thresholds.component';
import { NotificationsComponent } from './pages/admin_panel/admin/notifications/notifications.component';
import { ReportsComponent } from './pages/admin_panel/admin/reports/reports.component';
import { MonitoringComponent } from './pages/admin_panel/admin/monitoring/monitoring.component';
import { DatabaseComponent } from './pages/admin_panel/admin/database/database.component';
import { SystemComponent } from './pages/admin_panel/admin/system/system.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'refrigerators', component: RefrigeratorsComponent, canActivate: [AuthGuard] },
  { path: 'refrigerators/:id', component: RefrigeratorDetailsComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailsComponent, canActivate: [AuthGuard] },
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'recommendations', component: RecommendationsComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'fridges', component: FridgesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'sensors', component: SensorsComponent },
      { path: 'thresholds', component: ThresholdsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'monitoring', component: MonitoringComponent },
      { path: 'database', component: DatabaseComponent },
      { path: 'system', component: SystemComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
