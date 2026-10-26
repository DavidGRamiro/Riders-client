import { Routes } from '@angular/router';
import { AuthenticateGuard } from './core';
import { GuestGuard } from './core/guards/guest-guard-guard';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/auth').then(m => m.routes), canActivateChild: [GuestGuard]},
  { path: 'home', loadChildren: () => import('./ui').then(m => m.routes), canActivateChild: [AuthenticateGuard]}
];
