import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import('./pages/index').then( m => m.Home),
  },
  { path: '*', redirectTo: '', pathMatch: 'full'}
];
