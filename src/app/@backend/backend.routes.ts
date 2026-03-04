import { Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
//TODO route 首位
export const backendRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'question',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'question/chart/:id',
    loadComponent: () =>
      import('./chart/chart.component').then((m) => m.ChartComponent),
  },
];
