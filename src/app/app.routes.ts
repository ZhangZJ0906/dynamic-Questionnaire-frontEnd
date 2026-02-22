import { Routes } from '@angular/router';
import { IndexComponent } from './@front/index/index.component';
import { ShowAllComponent } from './@front/show-all/show-all.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./@front/front.routes').then((m) => m.frontRoutes),
  },

  //後續要加入由首位
  {
    path: 'admin',
    loadChildren: () =>
      import('./@backend/backend.routes').then((m) => m.backendRoutes),
  },
];
