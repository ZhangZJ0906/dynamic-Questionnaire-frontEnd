import { FeedBackComponent } from './feed-back/feed-back.component';
import { Routes } from '@angular/router';

export const frontRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./index/index.component').then((m) => m.IndexComponent),
  },

  //TODO後續要加入由首位
  {
    path: 'showAll',
    loadComponent: () =>
      import('./show-all/show-all.component').then((m) => m.ShowAllComponent),
  },
  {
    path: 'showquestion/:quizId',
    loadComponent: () =>
      import('./show-question/show-question.component').then(
        (m) => m.ShowQuestionComponent,
      ),
  },
  {
    path: 'showFeedBack/:quizId',
    loadComponent: () =>
      import('./feed-back/feed-back.component').then(
        (m) => m.FeedBackComponent,
      ),
  },
];
