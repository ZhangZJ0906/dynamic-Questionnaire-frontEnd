import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";


export interface link {
  id: number;
  name: string;
  route: string;
  icon:string
}
@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  linkArr: link[] = [
    {
      id: 1,
      name: '後台首頁',
      route: '/admin',
      icon:'home'
    },
    {
      id: 2,
      name: '問卷',
      route: 'user',
      icon:'account_circle'
    },
    //     {
    //   id: 3,
    //   name: '新增',
    //   route: 'new',
    //   icon:'add_diamond'
    // },
  ];
}
