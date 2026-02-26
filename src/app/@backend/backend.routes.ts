import { Routes } from '@angular/router';

export const backendRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
    {
    path: 'dialog',
    loadComponent: () =>
      import('./dialog/dialog.component').then(
        (m) => m.DialogComponent,
      ),
  },
];
