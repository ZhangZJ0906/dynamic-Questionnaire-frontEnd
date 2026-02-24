import { SidebarComponent } from '../sidebar/sidebar.component';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

export interface user {
  name: string;
  content: string;
  attendance: number;
}
@Component({
  selector: 'app-user',
  imports: [
    SidebarComponent,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  userArr: user[] = [
    {
      name: '會員人數:',
      content: '人',
      attendance: 889,
    },
        {
      name: '問卷總數:',
      content: '個',
      attendance: 889,
    },
  ];

}
