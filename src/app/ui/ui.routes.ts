import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", loadComponent: () => import('./index').then( m => m.Home)},
  { path: "routes", loadComponent: () => import('./index').then(m => m.Routes)},
  { path: "events", loadComponent: () => import('./index').then(m => m.Events)},
  { path: "comunity", loadComponent: () => import('./index').then(m => m.Comunity)},
  { path: "garage", loadComponent: () => import('./index').then(m => m.Garage)},
  { path: '**', redirectTo: '', pathMatch: 'full'},
];
