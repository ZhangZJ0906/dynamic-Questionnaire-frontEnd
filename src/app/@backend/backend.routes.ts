import { Routes } from '@angular/router';
//TODO route 首位
export const backendRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    //回饋
    path: 'feedback/:id',
    loadComponent: () =>
      import('./feed-back/feed-back.component').then(
        (m) => m.FeedBackComponent,
      ),
  },

  {
    path: 'chart/:id',
    loadComponent: () =>
      import('../chart/chart.component').then((m) => m.ChartComponent),
  },
];
