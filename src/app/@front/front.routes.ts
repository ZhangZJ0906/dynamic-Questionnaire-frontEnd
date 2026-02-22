import { Routes } from '@angular/router';

export const frontRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./index/index.component').then((m) => m.IndexComponent),
  },

  //後續要加入由首位
  {
    path: 'showAll',
        loadComponent: () =>
      import('./show-all/show-all.component').then((m) => m.ShowAllComponent),
  },
];
