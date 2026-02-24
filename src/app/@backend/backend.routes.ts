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
  //   {
  //   path: 'new',
  //   loadComponent: () =>
  //     import('./new/new.component').then(
  //       (m) => m.NewComponent,
  //     ),
  // },
];
