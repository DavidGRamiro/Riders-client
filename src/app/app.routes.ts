import { Routes } from '@angular/router';
import { AuthenticateGuard } from './core';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/auth').then(m => m.routes)},
  { path: 'home', loadChildren: () => import('./ui').then(m => m.routes), canActivateChild: [AuthenticateGuard]}
];
