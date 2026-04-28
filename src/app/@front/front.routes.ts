import { Routes } from '@angular/router';
import { userAuthGuard } from '../@services/auth.guard.service';

export const frontRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./index/index.component').then((m) => m.IndexComponent),
  },

  //TODO後續要加入由首位
  {
    path: 'showAll',
    canActivate: [userAuthGuard],
    loadComponent: () =>
      import('./show-all/show-all.component').then((m) => m.ShowAllComponent),
  },
  {
    path: 'showquestion/:quizId',
    canActivate: [userAuthGuard],
    loadComponent: () =>
      import('./show-question/show-question.component').then(
        (m) => m.ShowQuestionComponent,
      ),
  },
  {
    path: 'chart/:id',
    canActivate: [userAuthGuard],
    loadComponent: () =>
      import('../chart/chart.component').then((m) => m.ChartComponent),
  },
];
