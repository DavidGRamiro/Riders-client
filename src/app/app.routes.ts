import { Routes } from '@angular/router';
import { AuthenticateGuard } from './core';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/auth').then(m => m.routes)},
  { path: 'main', loadComponent: () => import('./ui/pages').then(m => m.Main), canActivate: [AuthenticateGuard]}
];
