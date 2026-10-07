import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard-layout/dashboard-layout').then(
        (m) => m.DashboardLayout
      ),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/dashboard/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'cliente',
        loadComponent: () =>
          import('./pages/dashboard/cliente/cliente').then((m) => m.Cliente),
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./pages/dashboard/ordenes/ordenes').then((m) => m.Ordenes),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
