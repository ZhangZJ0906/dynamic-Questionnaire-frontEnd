import { Routes } from '@angular/router';
import { authGuard } from './@services/auth.guard.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./@front/front.routes').then((m) => m.frontRoutes),
  },

  //後續要加入由首位
  {
    path: 'admin',
    canActivate:[authGuard],
    loadChildren: () =>
      import('./@backend/backend.routes').then((m) => m.backendRoutes),
  },
];
