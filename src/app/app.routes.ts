import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'dashboard', loadComponent: () => import('./product-dashboard/product-dashboard').then(m => m.ProductDashboard) },
  { path: '**', redirectTo: '/home' }
];
