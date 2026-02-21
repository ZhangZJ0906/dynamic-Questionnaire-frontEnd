import { Routes } from '@angular/router';
import { IndexComponent } from './@front/index/index.component';
import { ShowAllComponent } from './@front/show-all/show-all.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },

  //後續要加入由首位
  {
    path: 'showAll',
    component: ShowAllComponent,
  },
];
